CREATE TYPE public.app_role AS ENUM ('admin', 'operator');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.operator_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  company_name text NOT NULL DEFAULT '',
  contact_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  bank_name text NOT NULL DEFAULT '',
  account_holder text NOT NULL DEFAULT '',
  account_number text NOT NULL DEFAULT '',
  branch_code text NOT NULL DEFAULT '',
  logo_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.operator_profiles TO authenticated;
GRANT ALL ON public.operator_profiles TO service_role;
ALTER TABLE public.operator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Operators read own profile" ON public.operator_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Operators create own profile" ON public.operator_profiles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Operators update own profile" ON public.operator_profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Prevent operators from approving themselves
CREATE OR REPLACE FUNCTION public.protect_operator_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := OLD.status;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END; $$;
CREATE TRIGGER operator_profiles_protect BEFORE UPDATE ON public.operator_profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_operator_status();

CREATE TABLE public.operator_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id uuid NOT NULL,
  reference text NOT NULL DEFAULT ('BO-' || upper(substr(md5(random()::text), 1, 6))),
  client_name text NOT NULL DEFAULT '',
  client_email text NOT NULL DEFAULT '',
  client_phone text NOT NULL DEFAULT '',
  group_name text NOT NULL DEFAULT '',
  destination text NOT NULL DEFAULT '',
  check_in date,
  check_out date,
  adults integer NOT NULL DEFAULT 0,
  children_ages integer[] NOT NULL DEFAULT '{}',
  package_ids text[] NOT NULL DEFAULT '{}',
  bus_hire_code text NOT NULL DEFAULT '',
  bus_amount numeric NOT NULL DEFAULT 0,
  hotel_source text NOT NULL DEFAULT 'list',
  hotel_name text NOT NULL DEFAULT '',
  hotel_rate numeric NOT NULL DEFAULT 0,
  hotel_capacity integer NOT NULL DEFAULT 2,
  rooms integer NOT NULL DEFAULT 1,
  superior_room boolean NOT NULL DEFAULT false,
  superior_room_notes text NOT NULL DEFAULT '',
  flagged boolean NOT NULL DEFAULT false,
  package_total numeric NOT NULL DEFAULT 0,
  accommodation_total numeric NOT NULL DEFAULT 0,
  grand_total numeric NOT NULL DEFAULT 0,
  commission numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.operator_quotes TO authenticated;
GRANT ALL ON public.operator_quotes TO service_role;
ALTER TABLE public.operator_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Operators read own quotes" ON public.operator_quotes FOR SELECT TO authenticated
  USING (operator_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Approved operators create quotes" ON public.operator_quotes FOR INSERT TO authenticated
  WITH CHECK (operator_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.operator_profiles p WHERE p.user_id = auth.uid() AND p.status = 'approved'));
CREATE POLICY "Operators update own quotes" ON public.operator_quotes FOR UPDATE TO authenticated
  USING (operator_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (operator_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Operators delete own drafts" ON public.operator_quotes FOR DELETE TO authenticated
  USING (operator_id = auth.uid() AND status = 'draft');

-- Only admins may mark Completed
CREATE OR REPLACE FUNCTION public.protect_quote_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed' AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := OLD.status;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END; $$;
CREATE TRIGGER operator_quotes_protect BEFORE UPDATE ON public.operator_quotes
  FOR EACH ROW EXECUTE FUNCTION public.protect_quote_status();