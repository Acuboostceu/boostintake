-- BoostIntake Supabase Schema
-- Run this in Supabase SQL Editor

-- Clinics (accounts)
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  emails TEXT[] DEFAULT '{}',       -- PDF recipient emails
  logo_url TEXT,
  cancel_hours INTEGER DEFAULT 24,
  no_show_fee INTEGER DEFAULT 50,
  pin_hash TEXT,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'clinic')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intake tokens (SMS links)
CREATE TABLE IF NOT EXISTS intake_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE NOT NULL,
  phone TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submission logs (NO PHI stored)
CREATE TABLE IF NOT EXISTS submission_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  email_sent BOOLEAN DEFAULT FALSE,
  source TEXT DEFAULT 'link' CHECK (source IN ('link', 'tablet'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_intake_tokens_token ON intake_tokens(token);
CREATE INDEX IF NOT EXISTS idx_intake_tokens_clinic ON intake_tokens(clinic_id);
CREATE INDEX IF NOT EXISTS idx_intake_tokens_expires ON intake_tokens(expires_at);

-- Auto-cleanup expired tokens (run via pg_cron or Supabase scheduled function)
-- DELETE FROM intake_tokens WHERE expires_at < NOW() AND used = FALSE;

-- Row Level Security (RLS)
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_logs ENABLE ROW LEVEL SECURITY;

-- Since we use service key on backend, RLS blocks direct client access (security by default)
-- All access goes through our Express API which uses the service key
