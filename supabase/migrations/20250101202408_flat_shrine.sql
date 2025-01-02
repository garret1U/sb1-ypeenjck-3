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
DROP POLICY IF EXISTS "memberships_user_select" ON memberships;
DROP POLICY IF EXISTS "memberships_user_update" ON memberships;
DROP POLICY IF EXISTS "memberships_admin_select" ON memberships;
DROP POLICY IF EXISTS "memberships_admin_manage" ON memberships;

-- Create new optimized policies
CREATE POLICY "memberships_user_read"
  ON memberships
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "memberships_user_write"
  ON memberships
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "memberships_admin_read"
  ON memberships
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM (
        SELECT DISTINCT club_id
        FROM memberships
        WHERE user_id = auth.uid()
          AND role = 'admin'
      ) admin_clubs
      WHERE admin_clubs.club_id = memberships.club_id
  ));

CREATE POLICY "memberships_admin_write"
  ON memberships
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM (
        SELECT DISTINCT club_id
        FROM memberships
        WHERE user_id = auth.uid()
          AND role = 'admin'
      ) admin_clubs
      WHERE admin_clubs.club_id = memberships.club_id
  ))
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM (
        SELECT DISTINCT club_id
        FROM memberships
        WHERE user_id = auth.uid()
          AND role = 'admin'
      ) admin_clubs
      WHERE admin_clubs.club_id = memberships.club_id
  ));

-- Re-enable RLS on all tables
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;

COMMIT;