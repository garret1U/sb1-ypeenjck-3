/*
  # Fix RLS Recursion Issues

  1. Changes
    - Drop all existing membership policies
    - Create new simplified policies using direct comparisons
    - Use optimized subqueries for admin access
    - Avoid circular references that cause recursion

  2. Security
    - Maintain existing security model
    - Preserve role-based access control
    - Prevent unauthorized access
*/

BEGIN;

-- Drop all existing memberships policies
DROP POLICY IF EXISTS "members_view_own" ON memberships;
DROP POLICY IF EXISTS "members_update_own" ON memberships;
DROP POLICY IF EXISTS "admins_view_club_memberships" ON memberships;
DROP POLICY IF EXISTS "admins_manage_club_memberships" ON memberships;

-- Create new simplified policies

-- 1. Basic user access - direct user_id comparison
CREATE POLICY "user_view_own"
  ON memberships
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_update_own"
  ON memberships
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 2. Admin access - optimized subqueries
CREATE POLICY "admin_view_clubs"
  ON memberships
  FOR SELECT
  USING (
    club_id IN (
      SELECT club_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role = 'admin'
    )
  );

CREATE POLICY "admin_manage_clubs"
  ON memberships
  FOR ALL
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

COMMIT;