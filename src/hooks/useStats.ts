import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useClub } from '../contexts/ClubContext';
import type { GameType, GaugeType } from '../types';

interface PersonalStats {
  overall_average: number;
  longest_streak: number;
  total_rounds: number;
  perfect_rounds: number;
  average_trend: number;
  game_averages: Record<GameType, number>;
  score_history: Array<{
    date: string;
    score: number;
  }>;
}

interface TopShooter {
  id: string;
  name: string;
  average: number;
  high_score: number;
  rounds: number;
}

interface ClubStats {
  club_average: number;
  active_members: number;
  perfect_rounds_today: number;
  top_shooters: TopShooter[];
}

export function useStats() {
  const { selectedClub } = useClub();
  const [personalStats, setPersonalStats] = useState<PersonalStats | null>(null);
  const [clubStats, setClubStats] = useState<ClubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!selectedClub) {
      setPersonalStats(null);
      setClubStats(null);
      setIsLoading(false);
      return;
    }

    async function fetchStats() {
      try {
        setIsLoading(true);

        // Fetch club stats
        const { data: clubData, error: clubError } = await supabase
          .rpc('get_club_stats', { club_id: selectedClub.id });

        if (clubError) throw clubError;

        // Fetch personal stats
        const { data: personalData, error: personalError } = await supabase
          .rpc('get_personal_stats', { club_id: selectedClub.id });

        if (personalError) throw personalError;

        setClubStats(clubData);
        setPersonalStats(personalData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [selectedClub]);

  return {
    personalStats,
    clubStats,
    isLoading,
    error
  };
}