import { useState } from 'react';
import { Trophy, Medal, Award, Filter } from 'lucide-react';
import type { GameType, GaugeType } from '../../types';

interface LeaderboardEntry {
  id: string;
  name: string;
  straights: number;
  longest_streak: number;
}

interface OrganizationLeaderboardProps {
  data: Record<GameType, Record<GaugeType, LeaderboardEntry[]>>;
}

export function OrganizationLeaderboard({ data }: OrganizationLeaderboardProps) {
  const [selectedGame, setSelectedGame] = useState<GameType | 'all'>('all');
  const [selectedGauge, setSelectedGauge] = useState<GaugeType | 'all'>('all');

  const gameTypes: GameType[] = ['Skeet', 'Doubles Skeet', 'Trap', '5-Stand'];
  const gaugeTypes: GaugeType[] = ['12', '20', '28', '.410'];

  const getFilteredData = () => {
    if (selectedGame === 'all' && selectedGauge === 'all') {
      return gameTypes;
    }
    
    if (selectedGame === 'all') {
      return gameTypes.filter(game => 
        data[game]?.[selectedGauge as GaugeType]?.length > 0
      );
    }
    
    if (selectedGauge === 'all') {
      return [selectedGame].filter(game =>
        gaugeTypes.some(gauge => data[game]?.[gauge]?.length > 0)
      );
    }
    
    return [selectedGame].filter(game =>
      data[game]?.[selectedGauge as GaugeType]?.length > 0
    );
  };

  const getFilteredGauges = (game: GameType) => {
    if (selectedGauge === 'all') {
      return gaugeTypes.filter(gauge => data[game]?.[gauge]?.length > 0);
    }
    return [selectedGauge].filter(gauge => data[game]?.[gauge]?.length > 0);
  };

  const renderLeaderboardSection = (game: GameType, gauge: GaugeType, entries: LeaderboardEntry[]) => {
    const sortedEntries = [...entries].sort((a, b) => {
      if (b.longest_streak !== a.longest_streak) {
        return b.longest_streak - a.longest_streak;
      }
      return b.straights - a.straights;
    });

    return sortedEntries.length > 0 ? (
      <div key={`${game}-${gauge}`} className="space-y-2">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 pl-4">
          {gauge} Gauge
        </div>
        {sortedEntries.map((entry, index) => {
          const Icon = icons[index] || Award;
          return (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <Icon className={`h-5 w-5 ${index < 3 ? 'text-yellow-500' : 'text-gray-400'}`} />
                <div className="ml-3">
                  <p className="font-medium text-gray-900 dark:text-white">{entry.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {entry.straights}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Straights</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {entry.longest_streak}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Longest Streak</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ) : null;
  };

  const icons = [Trophy, Medal, Award];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Organization Leaderboard</h2>

        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGame('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedGame === 'all'
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All Games
            </button>
            {gameTypes.map(game => (
              <button
                key={game}
                onClick={() => setSelectedGame(game)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  selectedGame === game
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {game}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGauge('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedGauge === 'all'
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All Gauges
            </button>
            {gaugeTypes.map(gauge => (
              <button
                key={gauge}
                onClick={() => setSelectedGauge(gauge)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  selectedGauge === gauge
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {gauge} Gauge
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {getFilteredData().map(game => {
            const filteredGauges = getFilteredGauges(game);
            return filteredGauges.length > 0 ? (
              <div key={game} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  {game}
                </h3>
                {filteredGauges.map(gauge => 
                  renderLeaderboardSection(game, gauge, data[game]?.[gauge] || [])
                )}
              </div>
            ) : null;
          })}
          {getFilteredData().length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No records found for the selected filters
            </p>
          )}
        </div>
      </div>
    </div>
  );
}