/*
  # Add RLS policies for membership requests
  
  1. Policies Added
    - Users can view their own requests
    - Club admins can view requests for their club
    - Users can create requests
    - Club admins can update request status
  
  2. Security
    - Users can only see their own requests
    - Club admins have elevated permissions for their club
    - Request creation restricted to authenticated users
*/

-- Enable RLS on membership_requests
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;

-- Membership Requests Policies
CREATE POLICY "Users can view their own requests"
  ON membership_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Club admins can view requests for their club"
  ON membership_requests FOR SELECT
  USING (is_club_admin(club_id));

CREATE POLICY "Users can create requests"
  ON membership_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Club admins can update request status"
  ON membership_requests FOR UPDATE
  USING (is_club_admin(club_id))
  WITH CHECK (is_club_admin(club_id));