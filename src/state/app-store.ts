import { School, User } from '../domain/school/types';
import { AcademicYear, Term, Class, Stream, Subject } from '../domain/academics/types';
import { Student, Enrollment } from '../domain/students/types';
import { AssessmentComponent, GradeScale } from '../domain/assessments/types';
import { MarkEntry } from '../domain/reports/types';

export interface AppState {
  user: User | null;
  school: School;
  academicYears: AcademicYear[];
  terms: Term[];
  classes: Class[];
  streams: Stream[];
  subjects: Subject[];
  students: Student[];
  enrollments: Enrollment[];
  assessmentComponents: AssessmentComponent[];
  gradeScale: GradeScale[];
  marks: MarkEntry[];
  auditLogs: any[];
}
