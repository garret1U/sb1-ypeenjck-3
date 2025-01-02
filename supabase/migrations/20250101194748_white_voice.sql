/*
  # Fix Clubs Policies

  1. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies for clubs table
    - Use EXISTS with subqueries instead of function calls
    - Avoid circular references between tables

  2. Security
    - Enable RLS
    - Add policies for view/manage clubs
    - Add policies for admin management
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Club admins can update their club" ON clubs;
DROP POLICY IF EXISTS "Users can view clubs they belong to" ON clubs;

-- Create new simplified policies

-- 1. Users can view clubs they belong to
CREATE POLICY "view_club_membership"
  ON clubs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = clubs.id
      AND memberships.user_id = auth.uid()
    )
  );

-- 2. Club admins can update club details
CREATE POLICY "admin_update_club"
  ON clubs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = clubs.id
      AND memberships.user_id = auth.uid()
      AND memberships.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = clubs.id
      AND memberships.user_id = auth.uid()
      AND memberships.role = 'admin'
    )
  );