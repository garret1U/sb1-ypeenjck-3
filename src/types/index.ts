export type GameType = 'Skeet' | 'Doubles Skeet' | 'Trap' | '5-Stand';
export type GaugeType = '12' | '20' | '28' | '.410';
export type BirdResult = 'hit' | 'miss';
export interface Bird {
  result: BirdResult;
  isOption: boolean;
  missedBirdIndex?: number; // Index of the original missed bird if this is an option
}

export interface Score {
  score_id: string;
  game: GameType;
  gauge: GaugeType;
  date: string;
  starting_stand?: number;
  total_score: number;
  birds: Bird[];
  gun_id?: string | null;
}