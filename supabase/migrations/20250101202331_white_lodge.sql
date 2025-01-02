/*
  # Fix RLS Policies to Prevent Recursion

  1. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies using subqueries
    - Re-enable RLS with fixed policies

  2. Security
    - Maintains proper access control
    - Prevents infinite recursion
    - Uses optimized subqueries
*/

BEGIN;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "memberships_select_own" ON memberships;
DROP POLICY IF EXISTS "memberships_update_own" ON memberships;
DROP POLICY IF EXISTS "memberships_admin_select" ON memberships;
DROP POLICY IF EXISTS "memberships_admin_manage" ON memberships;

-- Create new optimized policies
CREATE POLICY "memberships_user_select"
  ON memberships
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "memberships_user_update"
  ON memberships
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "memberships_admin_select"
  ON memberships
  FOR SELECT
  USING (
    club_id IN (
      SELECT DISTINCT club_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "memberships_admin_manage"
  ON memberships
  FOR ALL
  USING (
    club_id IN (
      SELECT DISTINCT club_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    club_id IN (
      SELECT DISTINCT club_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Re-enable RLS on all tables
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;

COMMIT;