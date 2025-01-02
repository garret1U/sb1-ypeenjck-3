import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useClub } from '../contexts/ClubContext';
import type { Field } from '../types';

export function useFields() {
  const { selectedClub } = useClub();
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!selectedClub) {
      setFields([]);
      setIsLoading(false);
      return;
    }

    async function fetchFields() {
      try {
        setIsLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('fields')
          .select(`
            id,
            name,
            availability,
            configurations,
            maintenance_schedule (
              maintenance_date,
              note
            )
          `)
          .eq('club_id', selectedClub.id);

        if (supabaseError) throw supabaseError;

        setFields(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch fields'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchFields();
  }, [selectedClub]);

  const addField = async (field: Omit<Field, 'id'>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('fields')
        .insert([{ ...field, club_id: selectedClub?.id }])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      setFields(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add field');
    }
  };

  const updateField = async (id: string, updates: Partial<Field>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('fields')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      setFields(prev => prev.map(field => field.id === id ? data : field));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update field');
    }
  };

  const deleteField = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('fields')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      setFields(prev => prev.filter(field => field.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete field');
    }
  };

  return {
    fields,
    isLoading,
    error,
    addField,
    updateField,
    deleteField
  };
}