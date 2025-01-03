import type { GameType } from './index';

type FieldAvailability = 'available' | 'maintenance' | 'closed';

interface MaintenanceSchedule {
  date: string;
  note?: string;
}

interface FiveStandConfig {
  machines: Array<{
    position: string;
    type: string;
  }>;
  stands: number;
}

interface TrapConfig {
  wobble_trap: boolean;
  arc_angle: number;
}

interface SportingClaysStation {
  birds_per_station: number;
  machine_positions: string[];
}

interface SportingClaysConfig {
  total_stations: number;
  stations: SportingClaysStation[];
}

interface FieldConfigurations {
  '5-Stand'?: FiveStandConfig;
  'Trap'?: TrapConfig;
  'Sporting Clays'?: SportingClaysConfig;
}

export interface Field {
  id: string;
  name: string;
  availability: FieldAvailability;
  games_supported: GameType[];
  maintenance_schedule: MaintenanceSchedule[];
  configurations: FieldConfigurations;
}