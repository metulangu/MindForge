import { ComponentType } from 'react';

export type GameCategory = 'reflex' | 'memory' | 'logic' | 'math';

export interface GameConfig {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  icon: ComponentType<{ className?: string }>;
  path: string;
  color: string;
  tags: string[];
}
