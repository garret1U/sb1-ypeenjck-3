/*
  # Add Club Statistics Function
  
  1. New Functions
    - get_club_stats: Calculates statistics for a club including:
      - Club average
      - Active member count
      - Perfect rounds today
      - Recent games count
      - Top shooters
      - Leaderboard data
  
  2. Security
    - Function is marked as STABLE
    - Access controlled through RLS policies
*/

CREATE OR REPLACE FUNCTION get_club_stats(club_id uuid)
RETURNS json
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result json;
BEGIN
  -- Check if user has access to this club
  IF NOT EXISTS (
    SELECT 1 FROM memberships
    WHERE club_id = $1
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT json_build_object(
    'club_average', (
      SELECT COALESCE(AVG(total_score), 0)
      FROM scores s
      JOIN shooters sh ON s.shooter_id = sh.id
      JOIN memberships m ON sh.membership_id = m.id
      WHERE m.club_id = $1
    ),
    'active_members', (
      SELECT COUNT(DISTINCT m.id)
      FROM memberships m
      WHERE m.club_id = $1
      AND EXISTS (
        SELECT 1 FROM shooters s
        WHERE s.membership_id = m.id
        AND s.status = 'active'
      )
    ),
    'perfect_rounds_today', (
      SELECT COUNT(*)
      FROM scores s
      JOIN shooters sh ON s.shooter_id = sh.id
      JOIN memberships m ON sh.membership_id = m.id
      WHERE m.club_id = $1
      AND s.total_score = 25
      AND DATE(s.date) = CURRENT_DATE
    ),
    'recent_games', (
      SELECT COUNT(*)
      FROM scores s
      JOIN shooters sh ON s.shooter_id = sh.id
      JOIN memberships m ON sh.membership_id = m.id
      WHERE m.club_id = $1
      AND s.date >= NOW() - INTERVAL '7 days'
    ),
    'leaderboard', (
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT 
          s.game,
          s.gauge,
          sh.id as shooter_id,
          sh.name as shooter_name,
          COUNT(*) FILTER (WHERE s.total_score = 25) as straights,
          MAX(sh.longest_streak) as longest_streak
        FROM scores s
        JOIN shooters sh ON s.shooter_id = sh.id
        JOIN memberships m ON sh.membership_id = m.id
        WHERE m.club_id = $1
        GROUP BY s.game, s.gauge, sh.id, sh.name
        ORDER BY straights DESC, longest_streak DESC
      ) t
    )
  ) INTO result;

  RETURN result;
END;
$$;