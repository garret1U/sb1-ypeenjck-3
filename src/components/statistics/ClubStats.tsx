import { Users, Target, Trophy } from 'lucide-react';
import { useStats } from '../../hooks/useStats';
import { StatsCard } from './StatsCard';
import { TopShooters } from './TopShooters';

export function ClubStats() {
  const { clubStats } = useStats();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Club Statistics</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatsCard
          title="Club Average"
          value={clubStats?.club_average?.toFixed(1) || '0.0'}
          icon={Target}
        />
        <StatsCard
          title="Active Members"
          value={clubStats?.active_members?.toString() || '0'}
          icon={Users}
        />
        <StatsCard
          title="Perfect Rounds Today"
          value={clubStats?.perfect_rounds_today?.toString() || '0'}
          icon={Trophy}
        />
      </div>

      <TopShooters />
    </div>
  );
}