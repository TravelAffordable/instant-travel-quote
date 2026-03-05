
CREATE TABLE public.cached_hotel_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_alias text NOT NULL,
  real_hotel_name text NOT NULL,
  destination text NOT NULL,
  tier text NOT NULL,
  capacity text NOT NULL,
  crawled_rate numeric,
  room_type text,
  includes_breakfast boolean DEFAULT false,
  crawled_at timestamptz DEFAULT now(),
  is_available boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (hotel_alias, destination, capacity)
);

ALTER TABLE public.cached_hotel_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cached rates are publicly readable"
  ON public.cached_hotel_rates
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage cached rates"
  ON public.cached_hotel_rates
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
