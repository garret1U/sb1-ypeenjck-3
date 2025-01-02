import { Check, X } from 'lucide-react';
import type { GameType, BirdResult } from '../../types';
import { getStationConfig, addOptionShot } from '../../utils/gameConfig';

interface StationLayoutProps {
  game: GameType;
  birds: BirdResult[];
  onBirdResult: (result: BirdResult) => void;
  startingStation?: number;
}

export function StationLayout({ game, birds, onBirdResult, startingStation = 1 }: StationLayoutProps) {
  let config = getStationConfig(game, startingStation);
  
  // Add option shots for misses in Skeet
  if (game === 'Skeet' && birds.length > 0) {
    config = addOptionShot(config, birds);
  }
  
  const currentShot = config[birds.length];
  const currentStation = currentShot?.station || null;
  const totalShots = config.length;

  // Keep option shot visible after it's recorded
  const displayConfig = config;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-8 gap-1.5">
        {Array.from({ length: 8 }, (_, i) => i + 1).map(station => (
          <div
            key={station}
            className={`relative h-[70px] rounded-lg border ${
              currentStation === station
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200'
            } text-sm`}
          >
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
              {station}
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center p-1 gap-0.5">
              {displayConfig.map((shot, idx) => shot.station === station && (
                <div
                  key={idx}
                  className={`${shot.isOption ? 'w-2.5 h-2.5 rounded-sm' : 'w-2.5 h-2.5 rounded-full'} ${
                    idx < birds.length
                      ? birds[idx] === 'hit'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {birds.length < totalShots && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onBirdResult('hit')}
            className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 flex items-center text-sm"
          >
            <Check className="h-4 w-4 mr-1.5" />
            Hit
          </button>
          <button
            onClick={() => onBirdResult('miss')}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 flex items-center text-sm"
          >
            <X className="h-4 w-4 mr-1.5" />
            Miss
          </button>
        </div>
      )}
      
      <div className="text-center text-xs text-gray-600">
        Station {currentStation || 'Complete'}
        {currentShot?.isOption && ' (Option)'}
        • Shot {Math.min(birds.length + 1, totalShots)} of {totalShots}
      </div>
    </div>
  );
}