CREATE POLICY "Cached rates are publicly readable" ON public.cached_hotel_rates FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.cached_hotel_rates TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.grant_owner_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'travelaffordable2017@gmail.com' AND NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_owner_confirmed_grant_admin ON auth.users;
CREATE TRIGGER on_owner_confirmed_grant_admin
AFTER INSERT OR UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_owner_admin();