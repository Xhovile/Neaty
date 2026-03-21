import React from 'react';

export type Grade = string;

export interface School {
  id: string;
  name: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  motto?: string;
}

export interface AcademicYear {
  id: string;
  name: string; // e.g. "2024/2025"
  isCurrent: boolean;
}

export interface Term {
  id: string;
  academicYearId: string;
  name: string; // e.g. "Term 1", "Semester 1"
  isCurrent: boolean;
}

export interface Class {
  id: string;
  name: string; // e.g. "Grade 10", "Year 11"
}

export interface Stream {
  id: string;
  classId: string;
  name: string; // e.g. "Blue", "A", "Science"
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Teacher';
}

export interface Student {
  id: string;
  fullName: string;
  admissionNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  academicYearId: string;
  classId: string;
  streamId: string;
}

export interface AssessmentComponent {
  id: string;
  name: string; // e.g. "Test 1", "Midterm", "Final Exam"
  weight: number; // e.g. 20, 30, 50 (total should be 100)
  maxScore: number; // e.g. 20, 50, 100
}

export interface GradeScale {
  id: string;
  minScore: number;
  maxScore: number;
  grade: string;
  remark: string;
}

export interface MarkEntry {
  id: string;
  studentId: string;
  subjectId: string;
  termId: string;
  academicYearId: string;
  scores: { [componentId: string]: number }; // componentId -> score
  weightedTotal: number;
  grade: string;
  remark: string;
  rank?: number;
}

export interface User {
  id: string;
  username: string;
  role: 'Admin' | 'Teacher';
  schoolId: string;
}

export type Page = 
  | 'Dashboard' 
  | 'Students' 
  | 'Enrollments' 
  | 'MarksEntry' 
  | 'ReportCards' 
  | 'Rankings' 
  | 'Settings' 
  | 'Login';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface MarksEntryProps {
  students: Student[];
  enrollments: Enrollment[];
  subjects: Subject[];
  assessmentComponents: AssessmentComponent[];
  gradeScale: GradeScale[];
  currentTerm: Term;
  currentAcademicYear: AcademicYear;
  onSaveMarks: (mark: Omit<MarkEntry, 'id'>) => void;
  marks: MarkEntry[];
}

export interface ReportCardProps {
  students: Student[];
  marks: MarkEntry[];
  school: School;
  subjects: Subject[];
  assessmentComponents: AssessmentComponent[];
  gradeScale: GradeScale[];
  enrollments: Enrollment[];
  classes: Class[];
  streams: Stream[];
  terms: Term[];
  academicYears: AcademicYear[];
}

export interface SettingsProps {
  school: School;
  academicYears: AcademicYear[];
  terms: Term[];
  classes: Class[];
  streams: Stream[];
  subjects: Subject[];
  assessmentComponents: AssessmentComponent[];
  gradeScale: GradeScale[];
  onUpdateSchool: (school: School) => void;
  onUpdateAssessmentComponents: (components: AssessmentComponent[]) => void;
  onUpdateGradeScale: (scale: GradeScale[]) => void;
}
