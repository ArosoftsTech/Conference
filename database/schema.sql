
-- STRUCTURE DE LA BASE DE DONNÉES SUCCESS LIFE 2026 - VERSION SIMPLIFIÉE
-- Compatible avec PostgreSQL / Supabase

-- 1. TABLE DES PROFILS
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABLE DES TICKETS
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  user_id UUID,
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('MOBILE_MONEY', 'CRYPTO')),
  payment_screenshot_url TEXT,
  sender_phone TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VALIDATED', 'USED', 'REJECTED')),
  qr_code_data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABLE DES RÉSERVATIONS
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  prenoms TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  places INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABLE DES INTERVENANTS (SPEAKERS)
CREATE TABLE speakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles access" ON profiles FOR ALL USING (true);
CREATE POLICY "Public tickets access" ON tickets FOR ALL USING (true);
CREATE POLICY "Public reservations access" ON reservations FOR ALL USING (true);
CREATE POLICY "Public speakers access" ON speakers FOR ALL USING (true);

-- ==========================================
-- SEEDS ET ADMINISTRATION
-- ==========================================

-- Pour promouvoir l'utilisateur spécifique en administrateur :
-- Exécutez cette commande dans l'éditeur SQL de Supabase :
-- UPDATE profiles SET role = 'ADMIN' WHERE id = '78342b26-cc60-4ee1-b25d-859f482f43fa';

-- Si l'utilisateur n'existe pas encore, utilisez ceci :
INSERT INTO profiles (id, first_name, last_name, email, phone, role)
VALUES (
  '78342b26-cc60-4ee1-b25d-859f482f43fa', 
  'Admin', 
  'SuccessLife', 
  'admin@successlife.com', 
  '0700000000', 
  'ADMIN'
) ON CONFLICT (id) DO UPDATE SET role = 'ADMIN';
