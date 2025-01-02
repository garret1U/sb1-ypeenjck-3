import { Trophy, Medal, Award } from 'lucide-react';
import { useStats } from '../../hooks/useStats';

export function TopShooters() {
  const { clubStats } = useStats();
  const topShooters = clubStats?.top_shooters || [];

  const icons = [Trophy, Medal, Award];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performers</h3>
      
      {topShooters.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No data available</p>
      ) : (
        <div className="space-y-4">
          {topShooters.map((shooter, index) => {
            const Icon = icons[index] || Award;
            return (
              <div
                key={shooter.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5 text-yellow-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{shooter.name}</p>
                    <p className="text-sm text-gray-500">
                      {shooter.rounds} rounds • {shooter.average.toFixed(1)} avg
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {shooter.high_score}/25
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}