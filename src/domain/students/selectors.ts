import { AppState } from '../../state/app-store';

export const selectStudents = (state: AppState) => state.students;
export const selectEnrollments = (state: AppState) => state.enrollments;
