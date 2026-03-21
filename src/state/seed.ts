import { AppState } from './app-store';
import { 
  DEMO_SCHOOL, 
  DEMO_ACADEMIC_YEARS, 
  DEMO_TERMS, 
  DEMO_CLASSES, 
  DEMO_STREAMS, 
  DEMO_SUBJECTS, 
  DEMO_STUDENTS, 
  DEMO_ENROLLMENTS, 
  DEMO_ASSESSMENT_COMPONENTS, 
  DEMO_GRADE_SCALE 
} from '../shared/constants';

export const INITIAL_STATE: AppState = {
  user: null,
  school: DEMO_SCHOOL,
  academicYears: DEMO_ACADEMIC_YEARS,
  terms: DEMO_TERMS,
  classes: DEMO_CLASSES,
  streams: DEMO_STREAMS,
  subjects: DEMO_SUBJECTS,
  students: DEMO_STUDENTS,
  enrollments: DEMO_ENROLLMENTS,
  assessmentComponents: DEMO_ASSESSMENT_COMPONENTS,
  gradeScale: DEMO_GRADE_SCALE,
  marks: [],
  auditLogs: [],
};
