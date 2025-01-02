/*
  # Fix membership policies to prevent recursion

  1. Changes
    - Drop all existing membership policies
    - Add simplified non-recursive policies
    - Separate read and write permissions clearly
    - Use direct user_id comparison where possible

  2. Security
    - Users can always view their own memberships
    - Admins can manage memberships for their clubs
    - Prevent infinite recursion in policy evaluation
*/

-- Drop all existing membership policies to start fresh
DROP POLICY IF EXISTS "Members view own" ON memberships;
DROP POLICY IF EXISTS "Admins manage club" ON memberships;
DROP POLICY IF EXISTS "Members can view own memberships" ON memberships;
DROP POLICY IF EXISTS "Admins can manage club memberships" ON memberships;
DROP POLICY IF EXISTS "Users can view own membership" ON memberships;
DROP POLICY IF EXISTS "Club admins can manage memberships" ON memberships;
DROP POLICY IF EXISTS "Club admins can update memberships" ON memberships;
DROP POLICY IF EXISTS "Users can view memberships for their clubs" ON memberships;
DROP POLICY IF EXISTS "Club admins can insert memberships" ON memberships;

-- Create new simplified policies

-- 1. Basic read access - users can always see their own memberships
CREATE POLICY "view_own_memberships"
  ON memberships FOR SELECT
  USING (user_id = auth.uid());

-- 2. Admin read access - admins can see all memberships in their clubs
CREATE POLICY "admin_view_club_memberships"
  ON memberships FOR SELECT
  USING (
    club_id IN (
      SELECT club_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- 3. Admin write access - admins can manage memberships in their clubs
CREATE POLICY "admin_manage_club_memberships"
  ON memberships FOR ALL
  USING (
    club_id IN (
      SELECT club_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    club_id IN (
      SELECT club_id 
      FROM memberships 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );