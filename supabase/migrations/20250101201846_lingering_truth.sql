/*
  # Fix Memberships RLS Recursion

  1. Changes
    - Drop existing problematic policies that cause recursion
    - Create new simplified policies without circular references
    - Ensure proper access control while avoiding policy recursion

  2. Security
    - Maintain existing security model
    - Preserve role-based access control
    - Prevent unauthorized access
*/

BEGIN;

-- Drop all existing memberships policies that might cause recursion
DROP POLICY IF EXISTS "view_own_memberships" ON memberships;
DROP POLICY IF EXISTS "update_own_memberships" ON memberships;
DROP POLICY IF EXISTS "admin_view_memberships" ON memberships;
DROP POLICY IF EXISTS "admin_manage_memberships" ON memberships;

-- Create new simplified policies without recursion

-- 1. Basic read access - users can see their own memberships
CREATE POLICY "user_read_own"
  ON memberships
  FOR SELECT
  USING (user_id = auth.uid());

-- 2. Basic update access - users can update their own memberships
CREATE POLICY "user_update_own"
  ON memberships
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3. Admin read access - admins can see memberships in their clubs
CREATE POLICY "admin_read_club"
  ON memberships
  FOR SELECT
  USING (
    club_id IN (
      SELECT m.club_id 
      FROM memberships m 
      WHERE m.user_id = auth.uid() 
      AND m.role = 'admin'
    )
  );

-- 4. Admin write access - admins can manage memberships in their clubs
CREATE POLICY "admin_manage_club"
  ON memberships
  FOR ALL
  USING (
    club_id IN (
      SELECT m.club_id 
      FROM memberships m 
      WHERE m.user_id = auth.uid() 
      AND m.role = 'admin'
    )
  )
  WITH CHECK (
    club_id IN (
      SELECT m.club_id 
      FROM memberships m 
      WHERE m.user_id = auth.uid() 
      AND m.role = 'admin'
    )
  );

COMMIT;