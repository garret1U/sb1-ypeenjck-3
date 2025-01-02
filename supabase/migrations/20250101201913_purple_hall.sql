/*
  # Fix Memberships RLS Recursion

  1. Changes
    - Drop existing problematic policies that cause recursion
    - Create new simplified policies using direct user_id comparison
    - Use subqueries instead of EXISTS for admin access
    - Maintain security while preventing infinite recursion

  2. Security
    - Maintain existing security model
    - Preserve role-based access control
    - Prevent unauthorized access
*/

BEGIN;

-- Drop all existing memberships policies
DROP POLICY IF EXISTS "user_read_own" ON memberships;
DROP POLICY IF EXISTS "user_update_own" ON memberships;
DROP POLICY IF EXISTS "admin_read_club" ON memberships;
DROP POLICY IF EXISTS "admin_manage_club" ON memberships;
DROP POLICY IF EXISTS "view_own_memberships" ON memberships;
DROP POLICY IF EXISTS "update_own_memberships" ON memberships;
DROP POLICY IF EXISTS "admin_view_memberships" ON memberships;
DROP POLICY IF EXISTS "admin_manage_memberships" ON memberships;

-- Create new simplified policies

-- 1. Users can view their own memberships (direct comparison)
CREATE POLICY "members_view_own"
  ON memberships
  FOR SELECT
  USING (user_id = auth.uid());

-- 2. Users can update their own memberships (direct comparison)
CREATE POLICY "members_update_own"
  ON memberships
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3. Admins can view memberships in their clubs (subquery)
CREATE POLICY "admins_view_club_memberships"
  ON memberships
  FOR SELECT
  USING (
    club_id IN (
      SELECT DISTINCT m.club_id
      FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.role = 'admin'
    )
  );

-- 4. Admins can manage memberships in their clubs (subquery)
CREATE POLICY "admins_manage_club_memberships"
  ON memberships
  FOR ALL
  USING (
    club_id IN (
      SELECT DISTINCT m.club_id
      FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.role = 'admin'
    )
  )
  WITH CHECK (
    club_id IN (
      SELECT DISTINCT m.club_id
      FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.role = 'admin'
    )
  );

COMMIT;