import { AppState } from '../../state/app-store';

export const selectAcademicYears = (state: AppState) => state.academicYears;
export const selectTerms = (state: AppState) => state.terms;
export const selectClasses = (state: AppState) => state.classes;
export const selectStreams = (state: AppState) => state.streams;
export const selectSubjects = (state: AppState) => state.subjects;

export const selectCurrentTerm = (state: AppState) => state.terms.find(t => t.isCurrent) || state.terms[0];
export const selectCurrentYear = (state: AppState) => state.academicYears.find(y => y.isCurrent) || state.academicYears[0];
