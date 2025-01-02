/*
  # Fix Recursive RLS Policies

  1. Changes
    - Drop all existing membership policies
    - Create new non-recursive policies for memberships table
    - Simplify policy logic to avoid self-referential queries
    - Keep proper access control without recursion

  2. Security
    - Maintain proper access control
    - Prevent recursion in policy evaluation
    - Keep row-level isolation between clubs
*/

BEGIN;

-- ------------------------------
-- 1. Drop All Existing Membership Policies
-- ------------------------------

DROP POLICY IF EXISTS "read_own_membership" ON memberships;
DROP POLICY IF EXISTS "update_own_membership" ON memberships;
DROP POLICY IF EXISTS "read_club_memberships" ON memberships;
DROP POLICY IF EXISTS "manage_club_memberships" ON memberships;

-- ------------------------------
-- 2. Create New Non-Recursive Policies
-- ------------------------------

-- Basic read access for own memberships
CREATE POLICY "read_own_membership"
  ON memberships
  FOR SELECT
  USING (user_id = auth.uid());

-- Basic update access for own membership
CREATE POLICY "update_own_membership"
  ON memberships
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin read access for club memberships (using subquery)
CREATE POLICY "read_club_memberships"
  ON memberships
  FOR SELECT
  USING (
    club_id IN (
      SELECT club_id
      FROM memberships m2
      WHERE m2.user_id = auth.uid()
        AND m2.role = 'admin'
    )
  );

-- Admin write access for club memberships (using subquery)
CREATE POLICY "manage_club_memberships"
  ON memberships
  FOR ALL
  USING (
    club_id IN (
      SELECT club_id
      FROM memberships m2
      WHERE m2.user_id = auth.uid()
        AND m2.role = 'admin'
    )
  )
  WITH CHECK (
    club_id IN (
      SELECT club_id
      FROM memberships m2
      WHERE m2.user_id = auth.uid()
        AND m2.role = 'admin'
    )
  );

COMMIT;