import { createContext, useContext } from 'react';

export const UserContext = createContext<any>(null);

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}