import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useClub } from '../contexts/ClubContext';
import type { Shooter } from '../types';

export function useShooters() {
  const { selectedClub } = useClub();
  const [shooters, setShooters] = useState<Shooter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!selectedClub) {
      setShooters([]);
      setIsLoading(false);
      return;
    }

    async function fetchShooters() {
      try {
        setIsLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('shooters')
          .select(`
            id,
            name,
            status,
            joined_date,
            average,
            straights,
            longest_streak,
            memberships!inner(
              club_id
            )
          `)
          .eq('memberships.club_id', selectedClub.id);

        if (supabaseError) throw supabaseError;

        setShooters(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch shooters'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchShooters();
  }, [selectedClub]);

  return { shooters, isLoading, error };
}