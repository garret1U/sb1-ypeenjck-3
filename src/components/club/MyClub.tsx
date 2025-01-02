import { useState } from 'react';
import { ClubInfo } from './ClubInfo';
import { GameTypes } from './GameTypes';
import { FieldList } from './fields/FieldList';
import type { Club } from '../../types/club';

const defaultClub: Club = {
  name: 'My Gun Club',
  address: '',
  availableGames: ['Skeet', 'Trap']
};

export function MyClub() {
  const [club, setClub] = useState<Club>(defaultClub);

  const handleUpdate = (updates: Partial<Club>) => {
    setClub(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Club</h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        <ClubInfo club={club} onUpdate={handleUpdate} />
        <GameTypes 
          selectedGames={club.availableGames} 
          onUpdate={(games) => handleUpdate({ availableGames: games })} 
        />
        <FieldList />
      </div>
    </div>
  );
}