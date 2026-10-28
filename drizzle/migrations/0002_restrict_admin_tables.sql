DROP POLICY IF EXISTS "Featured hotels can be added" ON public.featured_hotels;
DROP POLICY IF EXISTS "Featured hotels can be removed" ON public.featured_hotels;
CREATE POLICY "Admins add featured hotels" ON public.featured_hotels FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins remove featured hotels" ON public.featured_hotels FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Rate overrides are publicly readable" ON public.rate_overrides;
CREATE POLICY "Admins read rate overrides" ON public.rate_overrides FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Rate history is publicly readable" ON public.rate_history;
CREATE POLICY "Admins read rate history" ON public.rate_history FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Cached rates are publicly readable" ON public.cached_hotel_rates;
CREATE POLICY "Admins read cached rates" ON public.cached_hotel_rates FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));