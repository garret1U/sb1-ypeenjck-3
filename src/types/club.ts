import type { GameType } from './index';

export interface Club {
  id?: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  founded?: string;
  memberCount?: number;
  description?: string;
}