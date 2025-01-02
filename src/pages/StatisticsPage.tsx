import { PersonalStats } from '../components/statistics/PersonalStats';
import { ClubStats } from '../components/statistics/ClubStats';

export default function StatisticsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
      <PersonalStats />
      <ClubStats />
    </div>
  );
}