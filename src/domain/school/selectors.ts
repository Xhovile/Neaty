import { AppState } from '../../state/app-store';

export const selectSchool = (state: AppState) => state.school;
export const selectUser = (state: AppState) => state.user;
