/*
  # Fix RLS Policies and Re-enable RLS

  1. Changes
    - Re-enable RLS on all tables
    - Create new non-recursive policies for memberships
    - Create policies for clubs and related tables

  2. Security
    - Proper access control restored
    - No recursive policies
    - Clear separation of concerns
*/

BEGIN;

-- Re-enable RLS on all tables
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;

-- Create new memberships policies
CREATE POLICY "memberships_select_own"
  ON memberships
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "memberships_update_own"
  ON memberships
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "memberships_admin_select"
  ON memberships
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.club_id = memberships.club_id
      AND m2.user_id = auth.uid()
      AND m2.role = 'admin'
      AND m2.id != memberships.id
    )
  );

CREATE POLICY "memberships_admin_manage"
  ON memberships
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.club_id = memberships.club_id
      AND m2.user_id = auth.uid()
      AND m2.role = 'admin'
      AND m2.id != memberships.id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.club_id = memberships.club_id
      AND m2.user_id = auth.uid()
      AND m2.role = 'admin'
      AND m2.id != memberships.id
    )
  );

-- Create clubs policies
CREATE POLICY "clubs_select_member"
  ON clubs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = id
      AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "clubs_update_admin"
  ON clubs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
    )
  );

-- Create fields policies
CREATE POLICY "fields_select_member"
  ON fields
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = club_id
      AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "fields_manage_admin"
  ON fields
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = club_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = club_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
    )
  );

COMMIT;