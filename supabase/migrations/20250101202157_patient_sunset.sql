/*
  # Temporarily Disable RLS

  1. Changes
    - Disable RLS on all tables to fix recursion issues
    - Drop problematic policies
    - Clean state for new policies

  2. Security
    - TEMPORARY measure only
    - Will be re-enabled with fixed policies
*/

BEGIN;

-- Disable RLS on all tables
ALTER TABLE memberships DISABLE ROW LEVEL SECURITY;
ALTER TABLE clubs DISABLE ROW LEVEL SECURITY;
ALTER TABLE fields DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedule DISABLE ROW LEVEL SECURITY;
ALTER TABLE club_games DISABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests DISABLE ROW LEVEL SECURITY;

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "user_view_own" ON memberships;
DROP POLICY IF EXISTS "user_update_own" ON memberships;
DROP POLICY IF EXISTS "admin_view_clubs" ON memberships;
DROP POLICY IF EXISTS "admin_manage_clubs" ON memberships;

COMMIT;