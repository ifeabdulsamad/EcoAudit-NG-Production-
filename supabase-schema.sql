-- EcoAudit NG Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  plan TEXT DEFAULT 'free', -- 'free', 'pro', or 'business'
  audit_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. AUDITS TABLE
-- ============================================
CREATE TABLE audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  location TEXT,
  energy_score INTEGER,
  audit_data JSONB,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. TEAM MEMBERS TABLE (Business plan)
-- ============================================
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(owner_id, member_id)
);

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. RLS POLICIES FOR PROFILES
-- ============================================

-- Users can view own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow insert on profiles (for trigger)
CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 6. RLS POLICIES FOR AUDITS
-- ============================================

-- Users can only view their own audits
CREATE POLICY "Users can view own audits"
  ON audits FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own audits
CREATE POLICY "Users can insert own audits"
  ON audits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own audits
CREATE POLICY "Users can delete own audits"
  ON audits FOR DELETE
  USING (auth.uid() = user_id);

-- Users can only update their own audits
CREATE POLICY "Users can update own audits"
  ON audits FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 7. RLS POLICIES FOR TEAM MEMBERS
-- ============================================

-- Team owners can view their team
CREATE POLICY "Owners can view their team"
  ON team_members FOR SELECT
  USING (auth.uid() = owner_id);

-- Team members can view their memberships
CREATE POLICY "Members can view their teams"
  ON team_members FOR SELECT
  USING (auth.uid() = member_id);

-- Owners can add team members
CREATE POLICY "Owners can add team members"
  ON team_members FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Owners can remove team members
CREATE POLICY "Owners can remove team members"
  ON team_members FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================
-- 8. FUNCTION: INCREMENT AUDIT COUNT
-- ============================================
CREATE OR REPLACE FUNCTION increment_audit_count(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET audit_count = audit_count + 1,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$;

-- ============================================
-- 9. TRIGGER: CREATE PROFILE ON SIGNUP
-- ============================================
-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger to call function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 10. REALTIME SUBSCRIPTION (optional)
-- ============================================
-- Enable realtime for audits table if you want live updates
ALTER PUBLICATION supabase_realtime ADD TABLE audits;

-- ============================================
-- VERIFICATION QUERIES (run these to test)
-- ============================================
-- Check if tables exist:
-- SELECT * FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS policies:
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Test trigger exists:
-- SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';