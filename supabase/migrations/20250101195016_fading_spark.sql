/*
  # Update Clubs Policies

  1. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies for clubs table
    - Implement view/update policies
    - Avoid circular references between tables

  2. Security
    - Enable RLS
    - Add policies for viewing clubs
    - Add policies for admin updates
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "view_club_membership" ON clubs;
DROP POLICY IF EXISTS "admin_update_club" ON clubs;

-- Create new simplified policies

-- 1. Users can view clubs they belong to
CREATE POLICY "Users can view clubs they belong to"
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
      SELECT 1 FROM memberships m
      WHERE m.club_id = clubs.id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = clubs.id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
    )
  );