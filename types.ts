export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
}

export type FlowerType = 'rose' | 'sunflower' | 'tulip' | 'daisy';

export interface FlowerConfig {
  id: FlowerType;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export type GameState = 'setup' | 'loading' | 'playing' | 'completed';

export interface PlantedFlower {
  id: number;
  type: FlowerType;
  x: number; // random position for visual variety
  y: number;
}
