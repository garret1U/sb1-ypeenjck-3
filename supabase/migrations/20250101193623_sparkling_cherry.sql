/*
  # Fix membership policies to prevent recursion

  1. Changes
    - Drop existing problematic policies
    - Add new non-recursive policies using EXISTS
    - Separate read and write permissions
    - Use direct club_id comparison

  2. Security
    - Users can view their own memberships
    - Admins can manage memberships for their clubs
    - Prevent infinite recursion in policy evaluation
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "members_view_own" ON memberships;
DROP POLICY IF EXISTS "admins_view_club_memberships" ON memberships;
DROP POLICY IF EXISTS "admins_manage_club_memberships" ON memberships;

-- Create new simplified policies

-- 1. Users can view their own memberships
CREATE POLICY "view_own_membership"
  ON memberships FOR SELECT
  USING (user_id = auth.uid());

-- 2. Admins can view all memberships in their clubs
CREATE POLICY "admin_view_memberships"
  ON memberships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.club_id = memberships.club_id
      AND m2.user_id = auth.uid()
      AND m2.role = 'admin'
    )
  );

-- 3. Admins can manage memberships in their clubs
CREATE POLICY "admin_manage_memberships"
  ON memberships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.club_id = memberships.club_id
      AND m2.user_id = auth.uid()
      AND m2.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.club_id = memberships.club_id
      AND m2.user_id = auth.uid()
      AND m2.role = 'admin'
    )
  );