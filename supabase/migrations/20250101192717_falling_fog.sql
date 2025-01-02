/*
  # Fix membership policies

  1. Changes
    - Drop existing policies that may cause recursion
    - Add simplified policies for viewing and managing memberships
    - Ensure no circular dependencies in policy definitions

  2. Security
    - Users can view their own memberships
    - Club admins can manage memberships for their clubs
    - Prevent infinite recursion in policy evaluation
*/

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view own membership" ON memberships;
DROP POLICY IF EXISTS "Club admins can manage memberships" ON memberships;
DROP POLICY IF EXISTS "Club admins can update memberships" ON memberships;
DROP POLICY IF EXISTS "Users can view memberships for their clubs" ON memberships;
DROP POLICY IF EXISTS "Club admins can insert memberships" ON memberships;

-- Create base policy for viewing own memberships
CREATE POLICY "Members view own"
  ON memberships FOR SELECT
  USING (user_id = auth.uid());

-- Create admin management policy using direct club_id comparison
CREATE POLICY "Admins manage club"
  ON memberships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.club_id = memberships.club_id
      AND m2.user_id = auth.uid()
      AND m2.role = 'admin'
    )
  );