import { isSupabaseConfigured } from '../lib/env';
import { loadRemoteState, saveRemoteState } from '../integrations/supabase/state-store';
import { AppState } from './app-store';
import { loadBrowserState, saveBrowserState } from './browser-storage';

export const saveState = async (state: AppState): Promise<void> => {
  saveBrowserState(state);

  if (!isSupabaseConfigured()) {
    return;
  }

  try {
    await saveRemoteState(state);
  } catch (error) {
    console.error('Remote save failed. Falling back to browser storage only.', error);
  }
};

export const loadState = async (): Promise<Partial<AppState> | undefined> => {
  const browserState = loadBrowserState();

  if (!isSupabaseConfigured()) {
    return browserState;
  }

  try {
    const remoteState = await loadRemoteState();
    if (remoteState) {
      return {
        ...browserState,
        ...remoteState,
        user: browserState?.user ?? null,
      };
    }
  } catch (error) {
    console.error('Remote load failed. Falling back to browser storage.', error);
  }

  return browserState;
};
