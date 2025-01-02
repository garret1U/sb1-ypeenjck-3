import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Membership {
  id: string;
  role: 'admin' | 'coach' | 'member';
  club_id: string;
}

interface Club {
  id: string;
  name: string;
}

export function useMemberships() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<Array<Membership & { club: Club }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setMemberships([]);
      setLoading(false);
      return;
    }

    async function fetchMembershipsAndClubs() {
      try {
        setLoading(true);
        
        // Step 1: Fetch user's memberships
        const { data: membershipData, error: membershipError } = await supabase
          .from('memberships')
          .select('id, role, club_id')
          .eq('user_id', user.id);

        if (membershipError) throw membershipError;

        if (!membershipData?.length) {
          setMemberships([]);
          return;
        }

        // Step 2: Fetch club details for each membership
        const clubIds = membershipData.map(m => m.club_id);
        const { data: clubData, error: clubError } = await supabase
          .from('clubs')
          .select('id, name')
          .in('id', clubIds);

        if (clubError) throw clubError;

        // Combine membership and club data
        const combinedData = membershipData.map(membership => ({
          ...membership,
          club: clubData?.find(club => club.id === membership.club_id) || { 
            id: membership.club_id,
            name: 'Unknown Club'
          }
        }));

        setMemberships(combinedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch memberships'));
      } finally {
        setLoading(false);
      }
    }

    fetchMembershipsAndClubs();
  }, [user]);

  return { memberships, loading, error };
}