/*
  # Update membership policies

  1. Changes
    - Drop existing policies
    - Add new policy for viewing own membership
    - Add policy for club admins to manage memberships
    - Remove redundant policies

  2. Security
    - Ensures users can only view their own memberships
    - Allows club admins to manage memberships for their clubs
    - Prevents infinite recursion in policies
*/

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view own membership" ON memberships;
DROP POLICY IF EXISTS "Club admins can manage memberships" ON memberships;
DROP POLICY IF EXISTS "Club admins can update memberships" ON memberships;
DROP POLICY IF EXISTS "Users can view memberships for their clubs" ON memberships;
DROP POLICY IF EXISTS "Club admins can insert memberships" ON memberships;

-- Create new policies
CREATE POLICY "Members can view own memberships"
  ON memberships FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage club memberships"
  ON memberships FOR ALL
  USING (EXISTS (
    SELECT 1 FROM memberships m2
    WHERE m2.club_id = memberships.club_id
    AND m2.user_id = auth.uid()
    AND m2.role = 'admin'
  ));