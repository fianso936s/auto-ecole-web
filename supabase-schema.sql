-- ============================================
-- bayaNail CRM - Supabase Schema
-- Execute this in your Supabase SQL Editor
-- ============================================

-- 1. Profiles table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'prospect')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- 2. Prospects table
CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'autre' CHECK (source IN ('instagram', 'site', 'bouche-a-oreille', 'google', 'autre')),
  status TEXT NOT NULL DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'contacte', 'rdv_pris', 'converti', 'perdu')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_contact TIMESTAMPTZ
);

-- 3. Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_service TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Appointments table (separate from clients)
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'planifie' CHECK (status IN ('planifie', 'termine', 'annule')),
  artisan TEXT,
  confirmed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Timeline entries table
CREATE TABLE IF NOT EXISTS timeline_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('prospect', 'client')),
  entity_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'note', 'status_change', 'rdv', 'conversion')),
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Système',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;

-- Profiles: authenticated users can read all, only own profile update
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_delete" ON profiles FOR DELETE TO authenticated USING (id != auth.uid());

-- Prospects: authenticated users have full access, anon can insert (web booking)
CREATE POLICY "prospects_select" ON prospects FOR SELECT TO authenticated USING (true);
CREATE POLICY "prospects_insert_auth" ON prospects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "prospects_insert_anon" ON prospects FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "prospects_update" ON prospects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "prospects_delete" ON prospects FOR DELETE TO authenticated USING (true);

-- Clients: authenticated users have full access, anon can insert (web booking)
CREATE POLICY "clients_select" ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "clients_insert_auth" ON clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "clients_insert_anon" ON clients FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "clients_update" ON clients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "clients_delete" ON clients FOR DELETE TO authenticated USING (true);

-- Appointments: authenticated users have full access, anon can insert (web booking)
CREATE POLICY "appointments_select" ON appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "appointments_insert_auth" ON appointments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "appointments_insert_anon" ON appointments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "appointments_update" ON appointments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "appointments_delete" ON appointments FOR DELETE TO authenticated USING (true);

-- Anon can also read clients to check if email exists (for web booking)
CREATE POLICY "clients_select_anon" ON clients FOR SELECT TO anon USING (true);

-- Timeline: authenticated users have full access, anon can insert (web booking auto-log)
CREATE POLICY "timeline_select" ON timeline_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "timeline_insert_auth" ON timeline_entries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "timeline_insert_anon" ON timeline_entries FOR INSERT TO anon WITH CHECK (true);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_email ON prospects(email);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_timeline_entity ON timeline_entries(entity_type, entity_id);

-- ============================================
-- Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Demo data (optional - run if you want test data)
-- ============================================

-- Insert demo prospects
INSERT INTO prospects (first_name, last_name, email, phone, source, status, notes, created_at) VALUES
  ('Amira', 'Benali', 'amira@email.com', '06 12 34 56 78', 'instagram', 'nouveau', 'Intéressée par glazed donut', '2026-03-20T10:00:00Z'),
  ('Fatima', 'Ouali', 'fatima@email.com', '06 98 76 54 32', 'site', 'contacte', 'A demandé les tarifs cat eye', '2026-03-18T14:00:00Z'),
  ('Léa', 'Dupont', 'lea@email.com', '07 11 22 33 44', 'bouche-a-oreille', 'rdv_pris', 'RDV le 28 mars', '2026-03-15T09:00:00Z'),
  ('Nadia', 'Khelifi', 'nadia@email.com', '06 55 44 33 22', 'google', 'perdu', 'Trop loin', '2026-03-10T12:00:00Z'),
  ('Chloé', 'Martin', 'chloe@email.com', '07 66 77 88 99', 'instagram', 'nouveau', 'Story vue, a DM pour infos', '2026-03-24T18:00:00Z');

-- Insert demo clients
INSERT INTO clients (id, first_name, last_name, email, phone, preferred_service, notes, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Sarah', 'Mansouri', 'sarah.m@email.com', '06 10 20 30 40', 'Glazed Donut', 'Cliente fidèle', '2025-09-15T10:00:00Z'),
  ('00000000-0000-0000-0000-000000000002', 'Inès', 'Boudjema', 'ines.b@email.com', '07 20 30 40 50', 'Cat Eye Magnétique', 'Aime les couleurs sombres', '2025-11-20T14:00:00Z'),
  ('00000000-0000-0000-0000-000000000003', 'Maya', 'Toure', 'maya.t@email.com', '06 30 40 50 60', 'Blooming Gel Japonais', 'Adore les motifs floraux', '2026-01-10T09:00:00Z');

-- Insert demo appointments for Sarah
INSERT INTO appointments (client_id, service, date, time, amount, status, confirmed) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Glazed Donut', '2026-03-20', '14:00', 45, 'termine', true),
  ('00000000-0000-0000-0000-000000000001', 'French Revisitée', '2026-02-15', '10:30', 50, 'termine', true),
  ('00000000-0000-0000-0000-000000000001', 'Glazed Donut', '2026-04-03', '14:00', 45, 'planifie', true);

-- Insert demo appointments for Inès
INSERT INTO appointments (client_id, service, date, time, amount, status, confirmed) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Cat Eye Magnétique', '2026-03-18', '11:00', 48, 'termine', true),
  ('00000000-0000-0000-0000-000000000002', 'Blooming Gel', '2026-01-05', '10:00', 55, 'termine', true);

-- Insert demo appointments for Maya
INSERT INTO appointments (client_id, service, date, time, amount, status, confirmed) VALUES
  ('00000000-0000-0000-0000-000000000003', 'Blooming Gel Japonais', '2026-03-22', '09:30', 60, 'termine', true),
  ('00000000-0000-0000-0000-000000000003', 'Milky Nails', '2026-02-20', '14:30', 40, 'termine', true);
