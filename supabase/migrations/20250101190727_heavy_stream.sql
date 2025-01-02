/*
  # Add club code and membership requests
  
  1. Changes
    - Add code and is_public fields to clubs table
    - Create membership_requests table for handling club join requests
  
  2. Security
    - Club codes must be unique
    - Membership requests track status
    - One request per user per club
*/

-- Add new columns to clubs table
ALTER TABLE IF EXISTS clubs 
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