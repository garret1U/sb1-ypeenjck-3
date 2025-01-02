/*
  # Disable RLS on All Tables

  1. Changes
    - Disable RLS on all tables
    - Drop all existing policies
    - Clean up database state

  2. Security
    - WARNING: This removes all RLS protection
    - Only use in development/testing
    - Not recommended for production
*/

BEGIN;

-- Disable RLS on all tables
ALTER TABLE memberships DISABLE ROW LEVEL SECURITY;
ALTER TABLE clubs DISABLE ROW LEVEL SECURITY;
ALTER TABLE fields DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedule DISABLE ROW LEVEL SECURITY;
ALTER TABLE club_games DISABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE shooters DISABLE ROW LEVEL SECURITY;
ALTER TABLE scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE guns DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "memberships_basic_read" ON memberships;
DROP POLICY IF EXISTS "memberships_basic_write" ON memberships;
DROP POLICY IF EXISTS "memberships_admin_view" ON memberships;
DROP POLICY IF EXISTS "memberships_admin_manage" ON memberships;

DROP POLICY IF EXISTS "clubs_select_member" ON clubs;
DROP POLICY IF EXISTS "clubs_update_admin" ON clubs;

DROP POLICY IF EXISTS "fields_select_member" ON fields;
DROP POLICY IF EXISTS "fields_manage_admin" ON fields;

DROP POLICY IF EXISTS "maintenance_schedule_admin_manage" ON maintenance_schedule;
DROP POLICY IF EXISTS "club_games_admin_only" ON club_games;
DROP POLICY IF EXISTS "membership_requests_view_admin" ON membership_requests;
DROP POLICY IF EXISTS "membership_requests_update_admin" ON membership_requests;

DROP POLICY IF EXISTS "Users can view scores in their clubs" ON scores;
DROP POLICY IF EXISTS "Users can manage their own guns" ON guns;

COMMIT;