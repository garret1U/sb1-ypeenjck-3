-- 20250102000000_initial_setup.sql

BEGIN;

-- ------------------------------
-- 1. Create Tables
-- ------------------------------

-- Clubs Table
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  code TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT false
);

-- Memberships Table
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'coach', 'member')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, club_id)
);

-- Shooters Table
CREATE TABLE shooters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  joined_date TIMESTAMPTZ DEFAULT now(),
  statistics JSONB
);

-- Scores Table
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shooter_id UUID REFERENCES shooters(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  date TIMESTAMPTZ DEFAULT now(),
  gun_id UUID REFERENCES guns(id) ON DELETE SET NULL
);

-- Guns Table
CREATE TABLE guns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shooter_id UUID REFERENCES shooters(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  configuration JSONB
);

-- ------------------------------
-- 2. Enable Row Level Security (RLS)
-- ------------------------------

ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE shooters ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE guns ENABLE ROW LEVEL SECURITY;

-- ------------------------------
-- 3. Define RLS Policies
-- ------------------------------

-- Clubs: Select
CREATE POLICY "Clubs: Select by members or public"
  ON clubs
  FOR SELECT
  USING (
    is_public = true
    OR EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = clubs.id
        AND memberships.user_id = auth.uid()
    )
  );

-- Clubs: Insert
CREATE POLICY "Clubs: Insert by admin"
  ON clubs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = clubs.id
        AND memberships.user_id = auth.uid()
        AND memberships.role = 'admin'
    )
  );

-- Clubs: Update
CREATE POLICY "Clubs: Update by admin"
  ON clubs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = clubs.id
        AND memberships.user_id = auth.uid()
        AND memberships.role = 'admin'
    )
  );

-- Clubs: Delete
CREATE POLICY "Clubs: Delete by admin"
  ON clubs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = clubs.id
        AND memberships.user_id = auth.uid()
        AND memberships.role = 'admin'
    )
  );

-- Memberships: Select
CREATE POLICY "Memberships: Select own or by admin"
  ON memberships
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = memberships.club_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'
    )
  );

-- Memberships: Insert
CREATE POLICY "Memberships: Insert own or by admin"
  ON memberships
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = memberships.club_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'
    )
  );

-- Memberships: Update
CREATE POLICY "Memberships: Update own or by admin"
  ON memberships
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = memberships.club_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'
    )
  );

-- Memberships: Delete
CREATE POLICY "Memberships: Delete by admin"
  ON memberships
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = memberships.club_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'
    )
  );

-- Shooters: Select
CREATE POLICY "Shooters: Select by club members"
  ON shooters
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = shooters.club_id
        AND memberships.user_id = auth.uid()
    )
  );

-- Shooters: Insert
CREATE POLICY "Shooters: Insert by admin or coach"
  ON shooters
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = shooters.club_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('admin', 'coach')
    )
  );

-- Shooters: Update
CREATE POLICY "Shooters: Update by admin or coach"
  ON shooters
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = shooters.club_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('admin', 'coach')
    )
  );

-- Shooters: Delete
CREATE POLICY "Shooters: Delete by admin"
  ON shooters
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = shooters.club_id
        AND memberships.user_id = auth.uid()
        AND memberships.role = 'admin'
    )
  );

-- Scores: Select
CREATE POLICY "Scores: Select own or by admin/coach"
  ON scores
  FOR SELECT
  USING (
    shooter_id IN (
      SELECT shooters.id FROM shooters
      WHERE shooters.id = scores.shooter_id
        AND shooters.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = scores.club_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('admin', 'coach')
    )
  );

-- Scores: Insert
CREATE POLICY "Scores: Insert own or by admin/coach"
  ON scores
  FOR INSERT
  WITH CHECK (
    shooter_id IN (
      SELECT shooters.id FROM shooters
      WHERE shooters.id = scores.shooter_id
        AND shooters.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = scores.club_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('admin', 'coach')
    )
  );

-- Scores: Update
CREATE POLICY "Scores: Update own or by admin/coach"
  ON scores
  FOR UPDATE
  USING (
    shooter_id IN (
      SELECT shooters.id FROM shooters
      WHERE shooters.id = scores.shooter_id
        AND shooters.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = scores.club_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('admin', 'coach')
    )
  );

-- Scores: Delete
CREATE POLICY "Scores: Delete by admin"
  ON scores
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = scores.club_id
        AND memberships.user_id = auth.uid()
        AND memberships.role = 'admin'
    )
  );

-- Guns: Select
CREATE POLICY "Guns: Select by club members"
  ON guns
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = guns.club_id
        AND memberships.user_id = auth.uid()
    )
  );

-- Guns: Insert
CREATE POLICY "Guns: Insert by admin or coach"
  ON guns
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = guns.club_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('admin', 'coach')
    )
  );

-- Guns: Update
CREATE POLICY "Guns: Update by admin or coach"
  ON guns
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = guns.club_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('admin', 'coach')
    )
  );

-- Guns: Delete
CREATE POLICY "Guns: Delete by admin"
  ON guns
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = guns.club_id
        AND memberships.user_id = auth.uid()
        AND memberships.role = 'admin'
    )
  );

COMMIT;