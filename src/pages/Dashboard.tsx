import { Trophy, Target, Users, TrendingUp, Plus } from 'lucide-react';
import { ScoreEntry } from '../components/scores/ScoreEntry';
import { OrganizationLeaderboard } from '../components/dashboard/OrganizationLeaderboard';
import { useState, useMemo } from 'react';
import { useStats } from '../hooks/useStats';
import type { Score } from '../types';

export default function Dashboard() {
  const [showScoreEntry, setShowScoreEntry] = useState(false);
  const { clubStats, isLoading } = useStats();

  const stats = useMemo(() => [
    { name: 'Total Shooters', value: clubStats?.active_members?.toString() || '0', icon: Users },
    { name: 'Recent Games', value: clubStats?.recent_games?.toString() || '0', icon: Target },
    { name: 'Straights Today', value: clubStats?.perfect_rounds_today?.toString() || '0', icon: Trophy },
    { name: 'Club Average', value: clubStats?.club_average?.toFixed(1) || '0.0', icon: TrendingUp },
  ], [clubStats]);

  const leaderboardData = useMemo(() => {
    if (!clubStats?.leaderboard) return {};
    
    // Transform the leaderboard data into the required format
    return clubStats.leaderboard.reduce((acc, entry) => {
      if (!acc[entry.game]) {
        acc[entry.game] = {};
      }
      if (!acc[entry.game][entry.gauge]) {
        acc[entry.game][entry.gauge] = [];
      }
      acc[entry.game][entry.gauge].push({
        id: entry.shooter_id,
        name: entry.shooter_name,
        straights: entry.straights,
        longest_streak: entry.longest_streak
      });
      return acc;
    }, {} as Record<string, Record<string, Array<{id: string; name: string; straights: number; longest_streak: number}>>>);
  }, [clubStats?.leaderboard]);

  const handleScoreSubmit = (score: Omit<Score, 'score_id' | 'shooter_id' | 'date'>) => {
    // TODO: Implement score submission
    console.log('Score submitted:', score);
    setShowScoreEntry(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <button
          onClick={() => setShowScoreEntry(!showScoreEntry)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Score
        </button>
      </div>

      {showScoreEntry && (
        <div className="mb-8">
          <ScoreEntry onSubmit={handleScoreSubmit} />
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <div className="mt-6">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No recent activity to display
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <OrganizationLeaderboard data={leaderboardData} />
      </div>
    </div>
  );
}