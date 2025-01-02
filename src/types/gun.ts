export type BarrelType = 'Single' | 'Over/Under' | 'Side-by-Side';
export type ChokeType = 'Cylinder (Cyl)' | 'Skeet (Skt)' | 'Improved Cylinder (IC)' | 
  'Light Modified (LM)' | 'Modified (Mod)' | 'Improved Modified (IM)' | 
  'Full (F)' | 'Extra Full (XF/SF)';

export interface BarrelConfig {
  type: BarrelType;
  chokes: {
    first: ChokeType;
    second?: ChokeType;  // For Over/Under and Side-by-Side
  };
}

export interface Gun {
  id: string;
  name: string;
  brand: string;
  gauge: '12' | '20' | '28' | '.410';
  barrelConfig: BarrelConfig;
  // Optional attributes
  model?: string;
  barrelLength?: number;
  action?: 'Break Action' | 'Semi-Auto' | 'Pump' | 'Bolt Action' | 'Lever Action';
  stock?: 'Standard' | 'Pistol Grip' | 'Adjustable';
  stockMaterial?: 'Wood' | 'Synthetic';
  weight?: number;
  sights?: 'Bead' | 'Ribbed' | 'Red Dot' | 'Scope';
  finish?: 'Blued' | 'Stainless' | 'Camo';
  notes?: string;
  isPrimary?: boolean;
}