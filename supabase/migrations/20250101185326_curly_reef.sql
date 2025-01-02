/*
  # Initial Schema Setup

  1. New Tables
    - clubs
    - memberships
    - shooters
    - guns
    - scores
    - fields
    - maintenance_schedule
    - club_games

  2. Security
    - Enable RLS on all tables
    - Create helper function for admin checks
*/

-- Create role enum type
CREATE TYPE user_role AS ENUM ('admin', 'coach', 'member');

-- Create clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  phone text,
  email text,
  website text,
  description text,
  founded text,
  member_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create memberships table (handles multi-tenant access)
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, club_id)
);

-- Create shooters table
CREATE TABLE IF NOT EXISTS shooters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid REFERENCES memberships(id) ON DELETE CASCADE,
  name text NOT NULL,
  joined_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  average numeric(5,2) DEFAULT 0,
  straights integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create guns table
CREATE TABLE IF NOT EXISTS guns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shooter_id uuid REFERENCES shooters(id) ON DELETE CASCADE,
  name text NOT NULL,
  brand text NOT NULL,
  gauge text NOT NULL CHECK (gauge IN ('12', '20', '28', '.410')),
  barrel_config jsonb NOT NULL,
  model text,
  barrel_length integer CHECK (barrel_length BETWEEN 18 AND 36),
  action text CHECK (action IN ('Break Action', 'Semi-Auto', 'Pump', 'Bolt Action', 'Lever Action')),
  notes text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shooter_id uuid REFERENCES shooters(id) ON DELETE CASCADE,
  gun_id uuid REFERENCES guns(id) ON DELETE SET NULL,
  game text NOT NULL CHECK (game IN ('Skeet', 'Doubles Skeet', 'Trap', '5-Stand')),
  gauge text NOT NULL CHECK (gauge IN ('12', '20', '28', '.410')),
  date timestamptz DEFAULT now(),
  starting_stand integer CHECK (starting_stand BETWEEN 1 AND 8),
  total_score integer NOT NULL CHECK (total_score BETWEEN 0 AND 25),
  birds jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create fields table
CREATE TABLE IF NOT EXISTS fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  name text NOT NULL,
  availability text NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'under_maintenance')),
  configurations jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create maintenance_schedule table
CREATE TABLE IF NOT EXISTS maintenance_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id uuid REFERENCES fields(id) ON DELETE CASCADE,
  maintenance_date date NOT NULL,
  note text,
  created_at timestamptz DEFAULT now()
);

-- Create club_games table
CREATE TABLE IF NOT EXISTS club_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  game_type text NOT NULL CHECK (game_type IN ('Skeet', 'Doubles Skeet', 'Trap', '5-Stand')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(club_id, game_type)
);

-- Enable Row Level Security
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE shooters ENABLE ROW LEVEL SECURITY;
ALTER TABLE guns ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_games ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user is club admin
CREATE OR REPLACE FUNCTION is_club_admin(club_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM memberships
    WHERE user_id = auth.uid()
    AND club_id = club_uuid
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;