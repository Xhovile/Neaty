import { AppState } from './app-store';

export const saveState = (state: AppState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('neaty_state', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

export const loadState = (): Partial<AppState> | undefined => {
  try {
    const serializedState = localStorage.getItem('neaty_state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state', err);
    return undefined;
  }
};
