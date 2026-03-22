import { AppState } from './app-store';
import { isSupabaseConfigured } from '../lib/env';
import { loadBrowserState, saveBrowserState } from './browser-storage';

export const saveState = async (state: AppState): Promise<void> => {
  saveBrowserState(state);
  if (isSupabaseConfigured()) {
    console.info('Supabase persistence enabled.');
  }
};

export const loadState = async (): Promise<Partial<AppState> | undefined> => {
  return loadBrowserState();
};
