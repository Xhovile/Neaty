import { AppState } from './app-store';

const STORAGE_KEY = 'neaty_state';

export const saveBrowserState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Could not save browser state', error);
  }
};

export const loadBrowserState = (): Partial<AppState> | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return undefined;
    }

    return JSON.parse(serializedState) as Partial<AppState>;
  } catch (error) {
    console.error('Could not load browser state', error);
    return undefined;
  }
};
