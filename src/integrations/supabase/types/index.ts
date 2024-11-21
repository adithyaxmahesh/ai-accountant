import type { Database } from './database.types';
export * from './database.types';
export * from './tax';
export * from './expense-patterns';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];