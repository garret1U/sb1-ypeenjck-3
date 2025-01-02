/*
  # Update RLS Policies

  1. Changes
    - Drop existing policies that depend on is_club_admin function
    - Drop maintenance_schedule policy first
    - Drop is_club_admin function with CASCADE
    - Create new non-recursive policies using inline EXISTS subqueries
    - Enable RLS on all relevant tables

  2. Security
    - Maintain proper access control
    - Prevent recursion in policy evaluation
    - Keep row-level isolation between clubs
*/

BEGIN;

-- ------------------------------
-- 1. Drop Maintenance Schedule Policy First
-- ------------------------------

DROP POLICY IF EXISTS "Club admins can manage maintenance schedules" ON maintenance_schedule;
DROP POLICY IF EXISTS "admin_manage_maintenance" ON maintenance_schedule;

-- ------------------------------
-- 2. Drop Other Existing RLS Policies
-- ------------------------------

DROP POLICY IF EXISTS "Club admins can manage fields" ON fields;
DROP POLICY IF EXISTS "admin_manage_fields" ON fields;
DROP POLICY IF EXISTS "Club admins can manage club games" ON club_games;
DROP POLICY IF EXISTS "admin_manage_club_games" ON club_games;
DROP POLICY IF EXISTS "Club admins can view requests for their club" ON membership_requests;
DROP POLICY IF EXISTS "Club admins can update request status" ON membership_requests;
DROP POLICY IF EXISTS "admin_view_membership_requests" ON membership_requests;
DROP POLICY IF EXISTS "admin_update_request_status" ON membership_requests;

-- ------------------------------
-- 3. Drop is_club_admin Function with CASCADE
-- ------------------------------

DROP FUNCTION IF EXISTS is_club_admin(uuid) CASCADE;

-- ------------------------------
-- 4. Create New Policies with Inline EXISTS Subqueries
-- ------------------------------

-- a. Create Policy for Maintenance Schedule
CREATE POLICY "maintenance_admin_manage"
  ON maintenance_schedule
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM fields f
      JOIN memberships m ON f.club_id = m.club_id
      WHERE f.id = maintenance_schedule.field_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM fields f
      JOIN memberships m ON f.club_id = m.club_id
      WHERE f.id = maintenance_schedule.field_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'::user_role
    )
  );

-- b. Create Policy for Fields
CREATE POLICY "fields_admin_manage"
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

-- c. Create Policy for Club Games
CREATE POLICY "club_games_admin_manage"
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

-- d. Create Policies for Membership Requests
CREATE POLICY "membership_requests_admin_view"
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

CREATE POLICY "membership_requests_admin_update"
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
-- 5. Enable Row-Level Security (RLS)
-- ------------------------------

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedule ENABLE ROW LEVEL SECURITY;

COMMIT;