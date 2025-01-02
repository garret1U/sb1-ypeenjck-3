import { createContext, useContext } from 'react';
import type { User } from '@clerk/clerk-react';

export const UserContext = createContext<User | null | undefined>(undefined);

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}