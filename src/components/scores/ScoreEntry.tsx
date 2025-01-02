import { useState, useEffect } from 'react';
import { Target, Hash } from 'lucide-react';
import type { GameType, GaugeType, BirdResult } from '../../types';
import { getTotalShots } from '../../utils/gameConfig';
import { StationLayout } from './StationLayout';
import { StartingStation } from './StartingStation';
import { QuickEntry } from './QuickEntry';
import { GunSelector } from './GunSelector';

interface ScoreEntryProps {
  onSubmit: (score: {
    game: GameType;
    gauge: GaugeType;
    birds: BirdResult[];
    total_score: number;
    starting_stand?: number;
  }) => void;
}

const GAME_TYPES: GameType[] = ['Skeet', 'Doubles Skeet', 'Trap', '5-Stand'];
const GAUGE_TYPES: GaugeType[] = ['12', '20', '28', '.410'];

export function ScoreEntry({ onSubmit }: ScoreEntryProps) {
  const [game, setGame] = useState<GameType>('Skeet');
  const [gauge, setGauge] = useState<GaugeType>('12');
  const [selectedGunId, setSelectedGunId] = useState<string | null>(null);
  const [startingStation, setStartingStation] = useState<number>(1);
  const [quickEntry, setQuickEntry] = useState(false);
  const [birds, setBirds] = useState<BirdResult[]>([]);

  const handleBirdResult = (result: BirdResult) => {
    setBirds([...birds, result]);
  };

  const handleUndo = () => {
    setBirds(birds.slice(0, -1));
  };

  const handleSubmit = () => {
    const scoreData = {
      game,
      gauge,
      birds,
      total_score: birds.filter(result => result === 'hit').length,
      gun_id: selectedGunId,
      ...(game === 'Trap' || game === '5-Stand' ? { starting_stand: startingStation } : {})
    };

    onSubmit(scoreData);
    setBirds([]);
    setSelectedGunId(null);
  };

  const handleQuickSubmit = (birds: BirdResult[]) => {
    const scoreData = {
      game,
      gauge,
      birds,
      total_score: birds.filter(result => result === 'hit').length,
      gun_id: selectedGunId,
      ...(game === 'Trap' || game === '5-Stand' ? { starting_stand: startingStation } : {})
    };
    onSubmit(scoreData);
  };

  const needsStartingStation = game === 'Trap' || game === '5-Stand';
  const isComplete = birds.length === getTotalShots(game);

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Enter New Score
          </h3>
          <button
            onClick={() => setQuickEntry(!quickEntry)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            {quickEntry ? (
              <>
                <Target className="h-4 w-4 mr-1.5" />
                Detailed Entry
              </>
            ) : (
              <>
                <Hash className="h-4 w-4 mr-1.5" />
                Quick Entry
              </>
            )}
          </button>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Game Type
            </label>
            <select
              value={game}
              onChange={(e) => {
                setGame(e.target.value as GameType);
                setBirds([]);
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
            >
              {GAME_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gauge
            </label>
            <select
              value={gauge}
              onChange={(e) => setGauge(e.target.value as GaugeType)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
            >
              {GAUGE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <GunSelector
          gauge={gauge}
          selectedGunId={selectedGunId}
          onSelect={setSelectedGunId}
        />

        {needsStartingStation && (
          <StartingStation
            game={game}
            station={startingStation}
            onChange={setStartingStation}
            disabled={birds.length > 0}
          />
        )}

        {quickEntry ? (
          <div className="mt-6">
            <QuickEntry
              totalShots={getTotalShots(game)}
              game={game}
              onComplete={handleQuickSubmit}
            />
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Birds: {birds.length} / {getTotalShots(game)}
              </span>
              {birds.length > 0 && (
                <button
                  type="button"
                  onClick={handleUndo}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800"
                >
                  Undo
                </button>
              )}
            </div>

            <StationLayout
              game={game}
              birds={birds}
              onBirdResult={handleBirdResult}
              startingStation={startingStation}
            />

            {isComplete && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Submit Score
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}