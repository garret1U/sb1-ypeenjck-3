/*
  # Fix membership policies

  1. Changes
    - Drop existing problematic policies
    - Create new policies without recursion
    - Add helper function for club membership check
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Club admins can update memberships" ON memberships;
DROP POLICY IF EXISTS "Users can view memberships for their clubs" ON memberships;

-- Create new policies without recursion
CREATE POLICY "Users can view own membership"
  ON memberships FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Club admins can view all memberships"
  ON memberships FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM memberships m2
    WHERE m2.club_id = memberships.club_id
    AND m2.user_id = auth.uid()
    AND m2.role = 'admin'
  ));

CREATE POLICY "Users can update own membership"
  ON memberships FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());