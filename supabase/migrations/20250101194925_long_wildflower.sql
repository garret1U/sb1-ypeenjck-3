/*
  # Update Memberships Policies

  1. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies for memberships table
    - Implement view/update own membership policies
    - Implement admin view/manage policies
    - Avoid circular references between tables

  2. Security
    - Enable RLS
    - Add policies for view/manage memberships
    - Add policies for admin management
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "view_own_memberships" ON memberships;
DROP POLICY IF EXISTS "update_own_memberships" ON memberships;
DROP POLICY IF EXISTS "admin_view_memberships" ON memberships;
DROP POLICY IF EXISTS "admin_manage_memberships" ON memberships;

-- Create new simplified policies

-- 1. Users can view their own memberships
CREATE POLICY "view_own_memberships"
  ON memberships FOR SELECT
  USING (user_id = auth.uid());

-- 2. Users can update their own membership
CREATE POLICY "update_own_memberships"
  ON memberships FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3. Admins can view all memberships in their clubs
CREATE POLICY "admin_view_memberships"
  ON memberships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.club_id = memberships.club_id
        AND m2.user_id = auth.uid()
        AND m2.role = 'admin'
    )
  );

-- 4. Admins can manage memberships in their clubs
CREATE POLICY "admin_manage_memberships"
  ON memberships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.club_id = memberships.club_id
        AND m2.user_id = auth.uid()
        AND m2.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.club_id = memberships.club_id
        AND m2.user_id = auth.uid()
        AND m2.role = 'admin'
    )
  );