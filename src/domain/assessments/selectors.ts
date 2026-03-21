import { AppState } from '../../state/app-store';

export const selectAssessmentComponents = (state: AppState) => state.assessmentComponents;
export const selectGradeScale = (state: AppState) => state.gradeScale;
