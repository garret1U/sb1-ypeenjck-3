import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useClub } from '../contexts/ClubContext';
import type { Gun } from '../types';

export function useGuns() {
  const { selectedClub } = useClub();
  const [guns, setGuns] = useState<Gun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!selectedClub) {
      setGuns([]);
      setIsLoading(false);
      return;
    }

    async function fetchGuns() {
      try {
        setIsLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('guns')
          .select(`
            id,
            name,
            brand,
            gauge,
            barrel_config,
            model,
            barrel_length,
            action,
            notes,
            is_primary,
            shooter:shooters!inner(
              id,
              memberships!inner(
                club_id
              )
            )
          `)
          .eq('shooters.memberships.club_id', selectedClub.id);

        if (supabaseError) throw supabaseError;

        setGuns(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch guns'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchGuns();
  }, [selectedClub]);

  const addGun = async (gun: Omit<Gun, 'id'>) => {
    try {
      if (gun.is_primary) {
        // Remove primary status from other guns first
        await supabase
          .from('guns')
          .update({ is_primary: false })
          .eq('shooter_id', gun.shooter_id);
      }

      const { data, error: supabaseError } = await supabase
        .from('guns')
        .insert([gun])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      setGuns(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add gun');
    }
  };

  const updateGun = async (id: string, updates: Partial<Gun>) => {
    try {
      if (updates.is_primary) {
        // Remove primary status from other guns first
        await supabase
          .from('guns')
          .update({ is_primary: false })
          .neq('id', id)
          .eq('shooter_id', updates.shooter_id);
      }

      const { data, error: supabaseError } = await supabase
        .from('guns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      setGuns(prev => prev.map(gun => gun.id === id ? data : gun));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update gun');
    }
  };

  const deleteGun = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('guns')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      setGuns(prev => prev.filter(gun => gun.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete gun');
    }
  };

  return {
    guns,
    isLoading,
    error,
    addGun,
    updateGun,
    deleteGun
  };
}