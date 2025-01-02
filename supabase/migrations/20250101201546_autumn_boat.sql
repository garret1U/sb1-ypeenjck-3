/*
  # Fix RLS Policies

  1. Changes
    - Drop existing policies that could cause conflicts
    - Create new policies with unique names
    - Replace is_club_admin function usage with inline EXISTS queries
    - Maintain proper access control without recursion

  2. Security
    - Maintain proper access control
    - Prevent recursion in policy evaluation
    - Keep row-level isolation between clubs
*/

BEGIN;

-- ------------------------------
-- 1. Drop Existing RLS Policies
-- ------------------------------

-- Fields policies
DROP POLICY IF EXISTS "admin_manage_fields" ON fields;
DROP POLICY IF EXISTS "fields_admin_manage" ON fields;
DROP POLICY IF EXISTS "fields_admin_only" ON fields;

-- Club games policies
DROP POLICY IF EXISTS "admin_manage_club_games" ON club_games;
DROP POLICY IF EXISTS "club_games_admin_manage" ON club_games;
DROP POLICY IF EXISTS "club_games_admin_only" ON club_games;

-- Membership requests policies
DROP POLICY IF EXISTS "admin_view_membership_requests" ON membership_requests;
DROP POLICY IF EXISTS "admin_update_request_status" ON membership_requests;
DROP POLICY IF EXISTS "membership_requests_admin_view" ON membership_requests;
DROP POLICY IF EXISTS "membership_requests_admin_update" ON membership_requests;
DROP POLICY IF EXISTS "membership_requests_view_admin" ON membership_requests;
DROP POLICY IF EXISTS "membership_requests_update_admin" ON membership_requests;

-- ------------------------------
-- 2. Create New Policies with Unique Names
-- ------------------------------

-- Fields management
CREATE POLICY "fields_management_by_admin"
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

-- Club games management
CREATE POLICY "club_games_management_by_admin"
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

-- Membership requests policies
CREATE POLICY "membership_requests_viewing_by_admin"
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

CREATE POLICY "membership_requests_updating_by_admin"
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
-- 3. Enable Row-Level Security
-- ------------------------------

ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;

COMMIT;