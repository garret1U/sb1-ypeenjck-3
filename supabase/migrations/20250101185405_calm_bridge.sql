/*
  # Row Level Security Policies

  1. Security Policies
    - Clubs: View and update policies
    - Memberships: View, insert, and update policies
    - Shooters: View and update policies
    - Scores: View, insert, and update policies
    - Guns: View and manage policies
    - Fields: View and manage policies
    - Maintenance Schedule: View and manage policies
    - Club Games: View and manage policies

  2. Access Control
    - Policies enforce club-based access control
    - Admin-specific policies for management operations
    - User-specific policies for personal data
*/

-- Clubs Policies
CREATE POLICY "Users can view clubs they belong to"
  ON clubs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = clubs.id
      AND memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Club admins can update their club"
  ON clubs FOR UPDATE
  USING (is_club_admin(id))
  WITH CHECK (is_club_admin(id));

-- Memberships Policies
CREATE POLICY "Users can view memberships for their clubs"
  ON memberships FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM memberships m2
      WHERE m2.club_id = memberships.club_id
      AND m2.user_id = auth.uid()
    )
  );

CREATE POLICY "Club admins can insert memberships"
  ON memberships FOR INSERT
  WITH CHECK (is_club_admin(club_id));

CREATE POLICY "Club admins can update memberships"
  ON memberships FOR UPDATE
  USING (is_club_admin(club_id))
  WITH CHECK (is_club_admin(club_id));

-- Shooters Policies
CREATE POLICY "Users can view shooters in their clubs"
  ON shooters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships m1
      JOIN memberships m2 ON m1.club_id = m2.club_id
      WHERE m2.id = shooters.membership_id
      AND m1.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own shooter profile"
  ON shooters FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.id = shooters.membership_id
      AND memberships.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.id = shooters.membership_id
      AND memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Club admins can update any shooter"
  ON shooters FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships m1
      JOIN memberships m2 ON m1.club_id = m2.club_id
      WHERE m2.id = shooters.membership_id
      AND m1.user_id = auth.uid()
      AND m1.role = 'admin'
    )
  );

-- Scores Policies
CREATE POLICY "Users can view scores in their clubs"
  ON scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM shooters s
      JOIN memberships m1 ON s.membership_id = m1.id
      JOIN memberships m2 ON m1.club_id = m2.club_id
      WHERE s.id = scores.shooter_id
      AND m2.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own scores"
  ON scores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shooters s
      JOIN memberships m ON s.membership_id = m.id
      WHERE s.id = scores.shooter_id
      AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own scores"
  ON scores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM shooters s
      JOIN memberships m ON s.membership_id = m.id
      WHERE s.id = scores.shooter_id
      AND m.user_id = auth.uid()
    )
  );

-- Guns Policies
CREATE POLICY "Users can view guns in their clubs"
  ON guns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM shooters s
      JOIN memberships m1 ON s.membership_id = m1.id
      JOIN memberships m2 ON m1.club_id = m2.club_id
      WHERE s.id = guns.shooter_id
      AND m2.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own guns"
  ON guns FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM shooters s
      JOIN memberships m ON s.membership_id = m.id
      WHERE s.id = guns.shooter_id
      AND m.user_id = auth.uid()
    )
  );

-- Fields Policies
CREATE POLICY "Users can view fields in their clubs"
  ON fields FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = fields.club_id
      AND memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Club admins can manage fields"
  ON fields FOR ALL
  USING (is_club_admin(club_id))
  WITH CHECK (is_club_admin(club_id));

-- Maintenance Schedule Policies
CREATE POLICY "Users can view maintenance schedules in their clubs"
  ON maintenance_schedule FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM fields f
      JOIN memberships m ON f.club_id = m.club_id
      WHERE f.id = maintenance_schedule.field_id
      AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Club admins can manage maintenance schedules"
  ON maintenance_schedule FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM fields f
      WHERE f.id = maintenance_schedule.field_id
      AND is_club_admin(f.club_id)
    )
  );

-- Club Games Policies
CREATE POLICY "Users can view club games in their clubs"
  ON club_games FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = club_games.club_id
      AND memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Club admins can manage club games"
  ON club_games FOR ALL
  USING (is_club_admin(club_id))
  WITH CHECK (is_club_admin(club_id));