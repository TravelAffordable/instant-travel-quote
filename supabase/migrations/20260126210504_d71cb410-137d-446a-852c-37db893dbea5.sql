-- Create enum for destinations
CREATE TYPE public.destination_code AS ENUM ('durban', 'cape_town', 'sun_city', 'mpumalanga', 'hartbeespoort', 'magaliesburg');

-- Create enum for room capacity
CREATE TYPE public.room_capacity AS ENUM ('2_sleeper', '4_sleeper');

-- Create enum for price tier
CREATE TYPE public.price_tier AS ENUM ('budget', 'affordable', 'premium');

-- Create areas table for location-specific groupings
CREATE TABLE public.areas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    destination destination_code NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(destination, name)
);

-- Create hotels table
CREATE TABLE public.hotels (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    area_id UUID NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
    address TEXT,
    tier price_tier NOT NULL,
    includes_breakfast BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create room types table
CREATE TABLE public.room_types (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity room_capacity NOT NULL,
    max_adults INTEGER NOT NULL DEFAULT 2,
    max_children INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create seasonal periods table
CREATE TABLE public.seasonal_periods (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.00,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CHECK (end_date >= start_date),
    CHECK (multiplier >= 0.5 AND multiplier <= 3.0)
);

-- Create base rates table (default rates for room types)
CREATE TABLE public.room_rates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    room_type_id UUID NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
    base_rate_weekday DECIMAL(10,2) NOT NULL,
    base_rate_weekend DECIMAL(10,2) NOT NULL,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

-- Create rate overrides for specific dates
CREATE TABLE public.rate_overrides (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    room_type_id UUID NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
    override_date DATE NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(room_type_id, override_date)
);

-- Create rate history for tracking changes
CREATE TABLE public.rate_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    room_type_id UUID NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weekday_rate DECIMAL(10,2),
    weekend_rate DECIMAL(10,2),
    source TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_history ENABLE ROW LEVEL SECURITY;

-- Create public read policies (rates need to be accessible to generate quotes)
CREATE POLICY "Areas are publicly readable" ON public.areas FOR SELECT USING (true);
CREATE POLICY "Hotels are publicly readable" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Room types are publicly readable" ON public.room_types FOR SELECT USING (true);
CREATE POLICY "Seasonal periods are publicly readable" ON public.seasonal_periods FOR SELECT USING (true);
CREATE POLICY "Room rates are publicly readable" ON public.room_rates FOR SELECT USING (true);
CREATE POLICY "Rate overrides are publicly readable" ON public.rate_overrides FOR SELECT USING (true);
CREATE POLICY "Rate history is publicly readable" ON public.rate_history FOR SELECT USING (true);

-- Create function to calculate rate for a specific date
CREATE OR REPLACE FUNCTION public.get_room_rate(
    p_room_type_id UUID,
    p_date DATE
)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
    v_base_rate DECIMAL(10,2);
    v_override_rate DECIMAL(10,2);
    v_multiplier DECIMAL(4,2) := 1.00;
    v_is_weekend BOOLEAN;
BEGIN
    -- Check for override first
    SELECT rate INTO v_override_rate
    FROM rate_overrides
    WHERE room_type_id = p_room_type_id AND override_date = p_date;
    
    IF v_override_rate IS NOT NULL THEN
        RETURN v_override_rate;
    END IF;
    
    -- Determine if weekend (Friday, Saturday, Sunday)
    v_is_weekend := EXTRACT(DOW FROM p_date) IN (0, 5, 6);
    
    -- Get base rate
    SELECT CASE WHEN v_is_weekend THEN base_rate_weekend ELSE base_rate_weekday END
    INTO v_base_rate
    FROM room_rates
    WHERE room_type_id = p_room_type_id
      AND is_active = true
      AND effective_from <= p_date
      AND (effective_to IS NULL OR effective_to >= p_date)
    ORDER BY effective_from DESC
    LIMIT 1;
    
    IF v_base_rate IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Get seasonal multiplier
    SELECT multiplier INTO v_multiplier
    FROM seasonal_periods
    WHERE is_active = true
      AND p_date BETWEEN start_date AND end_date
    ORDER BY multiplier DESC
    LIMIT 1;
    
    RETURN ROUND(v_base_rate * COALESCE(v_multiplier, 1.00), 2);
END;
$$;

-- Create function to get total stay cost
CREATE OR REPLACE FUNCTION public.get_stay_cost(
    p_room_type_id UUID,
    p_check_in DATE,
    p_check_out DATE
)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
    v_total DECIMAL(10,2) := 0;
    v_current_date DATE := p_check_in;
    v_daily_rate DECIMAL(10,2);
BEGIN
    WHILE v_current_date < p_check_out LOOP
        v_daily_rate := public.get_room_rate(p_room_type_id, v_current_date);
        IF v_daily_rate IS NOT NULL THEN
            v_total := v_total + v_daily_rate;
        END IF;
        v_current_date := v_current_date + INTERVAL '1 day';
    END LOOP;
    
    RETURN v_total;
END;
$$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON public.areas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON public.hotels FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_room_types_updated_at BEFORE UPDATE ON public.room_types FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_seasonal_periods_updated_at BEFORE UPDATE ON public.seasonal_periods FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_room_rates_updated_at BEFORE UPDATE ON public.room_rates FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_hotels_area_id ON public.hotels(area_id);
CREATE INDEX idx_hotels_tier ON public.hotels(tier);
CREATE INDEX idx_room_types_hotel_id ON public.room_types(hotel_id);
CREATE INDEX idx_room_types_capacity ON public.room_types(capacity);
CREATE INDEX idx_room_rates_room_type_id ON public.room_rates(room_type_id);
CREATE INDEX idx_room_rates_effective ON public.room_rates(effective_from, effective_to);
CREATE INDEX idx_rate_overrides_date ON public.rate_overrides(override_date);
CREATE INDEX idx_seasonal_periods_dates ON public.seasonal_periods(start_date, end_date);
CREATE INDEX idx_rate_history_room_type ON public.rate_history(room_type_id, recorded_date);