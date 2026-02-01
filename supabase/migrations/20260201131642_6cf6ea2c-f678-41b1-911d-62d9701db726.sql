-- Create Bela-Bela area
INSERT INTO public.areas (destination, name, description, is_active)
VALUES ('bela_bela', 'Bela-Bela Central', 'Bela-Bela (Warmbaths) and surrounding lodges', true);

-- Get the area ID for inserting hotels
DO $$
DECLARE
  bela_bela_area_id UUID;
  hotel_id UUID;
BEGIN
  SELECT id INTO bela_bela_area_id FROM public.areas WHERE destination = 'bela_bela' AND name = 'Bela-Bela Central';

  -- Insert all premium hotels for Bela-Bela
  -- 1. Babohi at Qwabi Private Game Reserve by NEWMARK
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Babohi at Qwabi Private Game Reserve by NEWMARK', 5, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 2. Letamo at Qwabi Private Game Reserve by NEWMARK
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Letamo at Qwabi Private Game Reserve by NEWMARK', 5, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 3. Waterberg Game Lodge
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Waterberg Game Lodge', 4, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 4. Schrikkloof Private Nature Reserve
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Schrikkloof Private Nature Reserve', 4, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 5. Ditholo Game Lodge Bela Bela
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Ditholo Game Lodge Bela Bela', 4, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 6. Klip en Kristal Guest House
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Klip en Kristal Guest House', 4, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 7. Hide Away Wedding Conference & Function Venue
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Hide Away Wedding Conference & Function Venue', 3, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 8. Summerset Place Country House
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Summerset Place Country House', 4, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 9. Thandile Country Lodge
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Thandile Country Lodge', 4, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 10. Mon Repos Guest Farm
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Mon Repos Guest Farm', 4, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 11. Elephant Springs
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Elephant Springs', 3, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 12. Genesis Guesthouze
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Genesis Guesthouze', 3, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 13. Shangri-La Country Hotel & Spa
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Shangri-La Country Hotel & Spa', 4, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 14. Grafiti Boutique Hotel
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Grafiti Boutique Hotel', 4, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 15. Aruka
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Aruka', 3, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 16. Kingfisher Villa in Mabula Game Reserve
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Kingfisher Villa in Mabula Game Reserve', 5, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 17. SABLE INN B&B
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'SABLE INN B&B', 4, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 18. Fairview Manor
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Fairview Manor', 5, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

  -- 19. Sage Haven Guesthouse
  INSERT INTO public.hotels (area_id, name, star_rating, tier, includes_breakfast, is_active)
  VALUES (bela_bela_area_id, 'Sage Haven Guesthouse', 4, 'premium', true, true)
  RETURNING id INTO hotel_id;
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '2 Sleeper Room', '2_sleeper', 2, 0, true);
  INSERT INTO public.room_types (hotel_id, name, capacity, max_adults, max_children, is_active)
  VALUES (hotel_id, '4 Sleeper Room', '4_sleeper', 4, 0, true);

END $$;

-- Add base rates for all Bela-Bela room types (using average pricing from screenshots)
INSERT INTO public.room_rates (room_type_id, base_rate_weekday, base_rate_weekend, effective_from, is_active)
SELECT 
  rt.id,
  CASE 
    WHEN rt.capacity = '2_sleeper' THEN 1800.00
    ELSE 2800.00
  END,
  CASE 
    WHEN rt.capacity = '2_sleeper' THEN 1980.00
    ELSE 3080.00
  END,
  CURRENT_DATE,
  true
FROM public.room_types rt
JOIN public.hotels h ON rt.hotel_id = h.id
JOIN public.areas a ON h.area_id = a.id
WHERE a.destination = 'bela_bela';