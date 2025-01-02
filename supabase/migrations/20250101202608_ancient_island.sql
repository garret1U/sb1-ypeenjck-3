/*
  # Drop is_club_admin Function

  1. Changes
    - Drop is_club_admin function with CASCADE option
    - Clean up database state

  2. Notes
    - CASCADE will remove any dependencies
    - Function is no longer needed since we use inline queries
*/

BEGIN;

-- Drop the is_club_admin function with CASCADE
DROP FUNCTION IF EXISTS is_club_admin(uuid) CASCADE;

COMMIT;