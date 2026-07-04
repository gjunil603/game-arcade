import type { ComponentType } from 'react';

export interface GameDefinition {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  component: ComponentType;
}
