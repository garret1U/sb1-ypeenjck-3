import type { GameType } from './index';

export interface Club {
  name: string;
  address?: string;
  availableGames: GameType[];
}