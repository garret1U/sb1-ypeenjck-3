/*
  # Fix RLS Recursion by Replacing is_club_admin(uuid) with Inline EXISTS Subqueries

  1. Changes
    - Drop existing policies that depend on is_club_admin function
    - Create new non-recursive policies using inline EXISTS subqueries
    - Enable RLS on all relevant tables
    - Drop is_club_admin function with CASCADE

  2. Security
    - Maintain proper access control
    - Prevent recursion in policy evaluation
    - Keep row-level isolation between clubs
*/

BEGIN;

-- ------------------------------
-- 1. Drop Existing RLS Policies that Depend on is_club_admin(uuid)
-- ------------------------------

-- For the 'fields' table
DROP POLICY IF EXISTS "Club admins can manage fields" ON fields;

-- For the 'club_games' table
DROP POLICY IF EXISTS "Club admins can manage club games" ON club_games;

-- For the 'membership_requests' table
DROP POLICY IF EXISTS "Club admins can view requests for their club" ON membership_requests;
DROP POLICY IF EXISTS "Club admins can update request status" ON membership_requests;

-- ------------------------------
-- 2. Recreate Policies with Inline EXISTS Subqueries
-- ------------------------------

-- a. Recreate Policy for 'fields' Table
CREATE POLICY "admin_manage_fields"
  ON fields
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = fields.club_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = fields.club_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'::user_role
    )
  );

-- b. Recreate Policy for 'club_games' Table
CREATE POLICY "admin_manage_club_games"
  ON club_games
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = club_games.club_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = club_games.club_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'::user_role
    )
  );

-- c. Recreate Policies for 'membership_requests' Table
CREATE POLICY "admin_view_membership_requests"
  ON membership_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = membership_requests.club_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'::user_role
    )
  );

CREATE POLICY "admin_update_request_status"
  ON membership_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = membership_requests.club_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = membership_requests.club_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'::user_role
    )
  );

-- ------------------------------
-- 3. Enable Row-Level Security (RLS) on All Relevant Tables
-- ------------------------------

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;

-- ------------------------------
-- 4. Drop the is_club_admin(uuid) Function with CASCADE
-- ------------------------------

DROP FUNCTION IF EXISTS is_club_admin(uuid) CASCADE;

COMMIT;