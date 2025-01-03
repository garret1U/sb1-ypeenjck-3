export type BarrelType = 'Single' | 'Over/Under' | 'Side-by-Side';

export type ChokeType = 
  | 'Cylinder (Cyl)'
  | 'Skeet (Skt)'
  | 'Improved Cylinder (IC)'
  | 'Light Modified (LM)'
  | 'Modified (Mod)'
  | 'Improved Modified (IM)'
  | 'Full (F)'
  | 'Extra Full (XF/SF)';

export interface Gun {
  id?: string;
  name: string;
  brand: string;
  model?: string;
  gauge: '12' | '20' | '28' | '.410';
  action?: 'Break Action' | 'Semi-Auto' | 'Pump' | 'Bolt Action' | 'Lever Action';
  barrelConfig: {
    type: BarrelType;
    chokes: {
      first: ChokeType;
      second?: ChokeType;
    };
  };
  barrelLength?: number;
  notes?: string;
  isPrimary?: boolean;
}