import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useClub } from '../contexts/ClubContext';
import type { Score } from '../types';

export function useScores(shooterId?: string) {
  const { selectedClub } = useClub();
  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!selectedClub) {
      setScores([]);
      setIsLoading(false);
      return;
    }

    async function fetchScores() {
      try {
        setIsLoading(true);
        let query = supabase
          .from('scores')
          .select(`
            id,
            game,
            gauge,
            date,
            starting_stand,
            total_score,
            birds,
            shooter:shooters!inner(
              id,
              name,
              memberships!inner(
                club_id
              )
            )
          `)
          .eq('shooters.memberships.club_id', selectedClub.id);

        if (shooterId) {
          query = query.eq('shooter_id', shooterId);
        }

        const { data, error: supabaseError } = await query
          .order('date', { ascending: false });

        if (supabaseError) throw supabaseError;

        setScores(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch scores'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchScores();
  }, [selectedClub, shooterId]);

  const addScore = async (score: Omit<Score, 'id' | 'date'>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('scores')
        .insert([score])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      setScores(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add score');
    }
  };

  return { scores, isLoading, error, addScore };
}