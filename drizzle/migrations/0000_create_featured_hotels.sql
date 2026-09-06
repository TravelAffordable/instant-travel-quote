CREATE TABLE public.featured_hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination text NOT NULL,
  hotel_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (destination, hotel_name)
);

GRANT SELECT, INSERT, DELETE ON public.featured_hotels TO anon;
GRANT SELECT, INSERT, DELETE ON public.featured_hotels TO authenticated;
GRANT ALL ON public.featured_hotels TO service_role;

ALTER TABLE public.featured_hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Featured hotels are publicly readable"
  ON public.featured_hotels FOR SELECT USING (true);

CREATE POLICY "Featured hotels can be added"
  ON public.featured_hotels FOR INSERT WITH CHECK (true);

CREATE POLICY "Featured hotels can be removed"
  ON public.featured_hotels FOR DELETE USING (true);