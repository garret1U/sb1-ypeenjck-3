import { createContext, useContext, useState, useEffect } from 'react';
import { useMemberships } from '../hooks/useMemberships';
import { useAuth } from './AuthContext';

interface Club {
  id: string;
  name: string;
  role: 'admin' | 'coach' | 'member';
}

interface ClubContextType {
  clubs: Club[];
  selectedClub: Club | null;
  selectClub: (clubId: string) => void;
  loading: boolean;
  error: Error | null;
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { memberships, loading: membershipsLoading, error: membershipsError } = useMemberships();
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  
  const clubs = memberships.map(({ club, role }) => ({
    id: club.id,
    name: club.name,
    role
  }));

  // Reset state when user changes
  useEffect(() => {
    if (!user) {
      setSelectedClub(null);
    }
  }, [user]);

  // Select first club by default
  useEffect(() => {
    if (clubs.length > 0 && !selectedClub) {
      setSelectedClub(clubs[0]);
    }
  }, [clubs, selectedClub]);

  const selectClub = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId);
    if (club) {
      setSelectedClub(club);
    }
  };

  // Persist selected club ID in localStorage
  useEffect(() => {
    if (selectedClub) {
      localStorage.setItem('selectedClubId', selectedClub.id);
    }
  }, [selectedClub]);

  return (
    <ClubContext.Provider value={{ clubs, selectedClub, selectClub, loading: authLoading || membershipsLoading, error: membershipsError }}>
      {children}
    </ClubContext.Provider>
  );
}

export function useClub() {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
}