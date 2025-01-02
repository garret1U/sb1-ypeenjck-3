export interface ShooterStatistics {
  average: number;
  straights: number;
  longest_streak: number;
}

export interface Shooter {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  joined_date: string;
  statistics: ShooterStatistics;
}