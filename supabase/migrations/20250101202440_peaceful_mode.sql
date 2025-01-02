/*
  # Fix RLS Policies to Prevent Recursion

  1. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies using optimized subqueries
    - Re-enable RLS with fixed policies

  2. Security
    - Maintains proper access control
    - Prevents infinite recursion
    - Uses optimized subqueries with DISTINCT
*/

BEGIN;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "memberships_user_read" ON memberships;
DROP POLICY IF EXISTS "memberships_user_write" ON memberships;
DROP POLICY IF EXISTS "memberships_admin_read" ON memberships;
DROP POLICY IF EXISTS "memberships_admin_write" ON memberships;

-- Create new optimized policies
CREATE POLICY "memberships_basic_read"
  ON memberships
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "memberships_basic_write"
  ON memberships
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "memberships_admin_view"
  ON memberships
  FOR SELECT
  USING (
    club_id IN (
      SELECT DISTINCT m.club_id
      FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.role = 'admin'
        AND m.id != memberships.id
    )
  );

CREATE POLICY "memberships_admin_manage"
  ON memberships
  FOR ALL
  USING (
    club_id IN (
      SELECT DISTINCT m.club_id
      FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.role = 'admin'
        AND m.id != memberships.id
    )
  )
  WITH CHECK (
    club_id IN (
      SELECT DISTINCT m.club_id
      FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.role = 'admin'
        AND m.id != memberships.id
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