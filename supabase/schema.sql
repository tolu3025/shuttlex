-- SHUTTLEX - PRODUCTION SUPABASE POSTGRESQL SCHEMA

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Base User Table linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('STUDENT', 'RIDER', 'ADMIN')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. STUDENT PROFILES
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    matric_number TEXT NOT NULL UNIQUE,
    faculty TEXT,
    department TEXT,
    wallet_balance NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. RIDER PROFILES
CREATE TABLE IF NOT EXISTS public.rider_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_online BOOLEAN DEFAULT false,
    verification_status TEXT DEFAULT 'VERIFIED' CHECK (verification_status IN ('VERIFIED', 'PENDING', 'SUSPENDED')),
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'pidgin', 'yo')),
    rating NUMERIC(3,2) DEFAULT 5.00,
    completed_rides_count INT DEFAULT 0,
    today_earnings NUMERIC(12,2) DEFAULT 0.00,
    wallet_balance NUMERIC(12,2) DEFAULT 0.00,
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BIKES (Motorcycle Info)
CREATE TABLE IF NOT EXISTS public.bikes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID NOT NULL REFERENCES public.rider_profiles(id) ON DELETE CASCADE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    color TEXT NOT NULL,
    plate_number TEXT NOT NULL UNIQUE,
    helmet_provided BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. CAMPUS LOCATIONS
CREATE TABLE IF NOT EXISTS public.campus_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('gate', 'academic', 'residence', 'hub', 'dining', 'medical', 'recreation')),
    description TEXT,
    latitude NUMERIC(10,8) NOT NULL,
    longitude NUMERIC(11,8) NOT NULL,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. RIDE REQUESTS & RIDES
CREATE TABLE IF NOT EXISTS public.rides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id),
    rider_id UUID REFERENCES public.profiles(id),
    pickup_name TEXT NOT NULL,
    pickup_lat NUMERIC(10,8) NOT NULL,
    pickup_lng NUMERIC(11,8) NOT NULL,
    destination_name TEXT NOT NULL,
    destination_lat NUMERIC(10,8) NOT NULL,
    destination_lng NUMERIC(11,8) NOT NULL,
    distance_km NUMERIC(6,2) NOT NULL,
    duration_mins INT NOT NULL,
    base_fare NUMERIC(10,2) NOT NULL,
    total_fare NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN (
        'REQUESTED', 'SEARCHING', 'OFFERED', 'ACCEPTED', 
        'RIDER_EN_ROUTE', 'ARRIVED', 'TRIP_STARTED', 'COMPLETED', 
        'DECLINED', 'CANCELLED_BY_STUDENT', 'CANCELLED_BY_RIDER', 'EXPIRED', 'DISPUTED'
    )),
    payment_method TEXT DEFAULT 'WALLET' CHECK (payment_method IN ('WALLET', 'PAYSTACK', 'CASH')),
    payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED')),
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE,
    arrived_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 7. RIDE STATUS EVENTS (Audit History)
CREATE TABLE IF NOT EXISTS public.ride_status_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    triggered_by TEXT NOT NULL CHECK (triggered_by IN ('STUDENT', 'RIDER', 'VOICE_AGENT', 'SYSTEM', 'ADMIN')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- 8. RIDER LOCATIONS (Realtime Coordinates)
CREATE TABLE IF NOT EXISTS public.rider_locations (
    rider_id UUID PRIMARY KEY REFERENCES public.rider_profiles(id) ON DELETE CASCADE,
    latitude NUMERIC(10,8) NOT NULL,
    longitude NUMERIC(11,8) NOT NULL,
    heading NUMERIC(5,2) DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. PAYMENTS & WALLETS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID NOT NULL REFERENCES public.rides(id),
    student_id UUID NOT NULL REFERENCES public.profiles(id),
    amount NUMERIC(10,2) NOT NULL,
    payment_provider TEXT DEFAULT 'PAYSTACK',
    provider_reference TEXT UNIQUE,
    status TEXT DEFAULT 'SUCCESS' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    amount NUMERIC(10,2) NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('DEPOSIT', 'RIDE_PAYMENT', 'RIDER_EARNING', 'WITHDRAWAL', 'REFUND')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. RATINGS & DISPUTES
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID NOT NULL REFERENCES public.rides(id) UNIQUE,
    student_id UUID NOT NULL REFERENCES public.profiles(id),
    rider_id UUID NOT NULL REFERENCES public.profiles(id),
    stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.ride_disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID NOT NULL REFERENCES public.rides(id),
    reported_by UUID NOT NULL REFERENCES public.profiles(id),
    issue_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'INVESTIGATING', 'RESOLVED', 'DISMISSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. VOICE AGENT LOGS
CREATE TABLE IF NOT EXISTS public.voice_agent_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID NOT NULL REFERENCES public.rider_profiles(id),
    is_active BOOLEAN DEFAULT true,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.voice_agent_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID NOT NULL REFERENCES public.rider_profiles(id),
    ride_id UUID REFERENCES public.rides(id),
    event_category TEXT NOT NULL,
    input_speech TEXT,
    detected_intent TEXT,
    confidence NUMERIC(4,3),
    agent_response TEXT NOT NULL,
    language TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rider_profiles ENABLE ROW LEVEL SECURITY;

-- Sample Policies
CREATE POLICY "Public read campus locations" ON public.campus_locations FOR SELECT USING (true);
CREATE POLICY "Students read own rides" ON public.rides FOR SELECT USING (auth.uid() = student_id OR auth.uid() = rider_id);

-- INDEXES for fast lookup
CREATE INDEX IF NOT EXISTS idx_rides_student ON public.rides(student_id);
CREATE INDEX IF NOT EXISTS idx_rides_rider ON public.rides(rider_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON public.rides(status);
CREATE INDEX IF NOT EXISTS idx_voice_events_rider ON public.voice_agent_events(rider_id);
