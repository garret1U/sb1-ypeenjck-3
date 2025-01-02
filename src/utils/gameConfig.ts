import type { GameType, BirdResult, Bird } from '../types';

interface ShotConfig {
  station: number;
  isOption?: boolean;
}

export function getTotalShots(game: GameType): number {
  switch (game) {
    case 'Skeet':
      return 25; // 4 shots at stations 1,2,6,7 and 2 shots at 3,4,5,8
    case 'Doubles Skeet':
      return 25; // 2 shots each at 1-7, 6-3, final 3 at station 2
    case 'Trap':
      return 25; // 5 shots at each of 5 stations
    case '5-Stand':
      return 25; // 5 shots at each of 5 stations
    default:
      return 25;
  }
}

export function getStationConfig(game: GameType, startingStation: number = 1): ShotConfig[] {
  switch (game) {
    case 'Skeet':
      const skeetConfig = [
        { station: 1 }, { station: 1 }, { station: 1 }, { station: 1 },
        { station: 2 }, { station: 2 }, { station: 2 }, { station: 2 },
        { station: 3 }, { station: 3 },
        { station: 4 }, { station: 4 },
        { station: 5 }, { station: 5 },
        { station: 6 }, { station: 6 }, { station: 6 }, { station: 6 },
        { station: 7 }, { station: 7 }, { station: 7 }, { station: 7 },
        { station: 8 }, { station: 8 }
      ];
      return skeetConfig;
    
    case 'Doubles Skeet':
      return [
        { station: 1 }, { station: 1 },
        { station: 2 }, { station: 2 },
        { station: 3 }, { station: 3 },
        { station: 4 }, { station: 4 },
        { station: 5 }, { station: 5 },
        { station: 6 }, { station: 6 },
        { station: 7 }, { station: 7 },
        { station: 6 }, { station: 6 },
        { station: 5 }, { station: 5 },
        { station: 4 }, { station: 4 },
        { station: 3 }, { station: 3 },
        { station: 2 }
      ];
    
    case 'Trap':
      return Array.from({ length: 25 }, (_, i) => {
        const station = ((startingStation - 1 + Math.floor(i / 5)) % 5) + 1;
        return { station };
      });
    
    case '5-Stand':
      return Array.from({ length: 25 }, (_, i) => {
        const station = ((startingStation - 1 + Math.floor(i / 5)) % 5) + 1;
        return { station };
      });
  }
}

export function addOptionShot(shots: ShotConfig[], birds: BirdResult[]): ShotConfig[] {
  // Validate inputs
  if (!Array.isArray(shots) || shots.length === 0 || !Array.isArray(birds)) {
    return shots;
  }

  // Find the first miss
  const firstMissIndex = birds.findIndex(bird => bird === 'miss');
  const hasOption = shots.some(shot => shot.isOption);
  
  // If already has an option shot, return original config
  if (hasOption || firstMissIndex >= shots.length) {
    return shots;
  }
  
  // If no misses and all birds recorded, add option to station 8
  if (firstMissIndex === -1 && birds.length >= 24) {
    return [...shots, { station: 8, isOption: true }];
  }
  
  // If there's a miss, add option after the first miss
  const missedShot = shots[firstMissIndex];
  if (!missedShot) {
    return shots;
  }
  
  const missedStation = missedShot.station;
  
  // Insert option right after the miss
  return [
    ...shots.slice(0, firstMissIndex + 1),
    { station: missedStation, isOption: true },
    ...shots.slice(firstMissIndex + 1)
  ];
}