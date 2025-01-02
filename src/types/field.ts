export type GameType = 'Skeet' | 'Doubles Skeet' | 'Trap' | '5-Stand' | 'Sporting Clays';
export type FieldAvailability = 'available' | 'under_maintenance';

export interface TrapMachine {
  id: number;
  location: string;
  angle?: number;
}

export interface TrapConfig {
  trap_house_location: string;
  wobble_trap: boolean;
  arc_angle: number;
}

export interface FiveStandConfig {
  stands: number;
  machines: TrapMachine[];
}

export interface SportingClaysStation {
  station_number: number;
  birds_per_station: number;
}

export interface SportingClaysConfig {
  total_stations: number;
  stations: SportingClaysStation[];
}

export interface MaintenanceEntry {
  date: string;
  note: string;
}

export interface FieldConfiguration {
  '5-Stand'?: FiveStandConfig;
  'Trap'?: TrapConfig;
  'Sporting Clays'?: SportingClaysConfig;
}

export interface Field {
  field_id: string;
  name: string;
  games_supported: GameType[];
  configurations: FieldConfiguration;
  maintenance_schedule: MaintenanceEntry[];
  availability: FieldAvailability;
}