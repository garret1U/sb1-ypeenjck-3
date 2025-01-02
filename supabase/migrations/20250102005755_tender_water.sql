/*
  # Add club signup functionality

  1. New Fields
    - Add `code` field to clubs table for joining
    - Add `is_public` flag for searchable clubs

  2. Security
    - Enable RLS on membership_requests table
    - Add policies for viewing and managing requests
*/

BEGIN;

-- Add new columns to clubs table
ALTER TABLE clubs 
ADD COLUMN IF NOT EXISTS code text NOT NULL UNIQUE,
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Create membership_requests table
CREATE TABLE IF NOT EXISTS membership_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, club_id)
);

-- Enable RLS
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;

-- Membership Requests Policies
CREATE POLICY "request_view_own"
  ON membership_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "request_view_admin"
  ON membership_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = membership_requests.club_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
    )
  );

CREATE POLICY "request_create"
  ON membership_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "request_update_admin"
  ON membership_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.club_id = membership_requests.club_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
    )
  );

COMMIT;