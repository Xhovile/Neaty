export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface Student {
  id: string;
  fullName: string;
  admissionNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  class: string;
  term: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Mark {
  id: string;
  studentId: string;
  subjectId: string;
  test1: number;
  test2: number;
  exam: number;
  total: number;
  average: number;
  grade: Grade;
  remark: string;
}

export interface User {
  username: string;
  role: 'Admin' | 'Teacher';
}

export type Page = 'Dashboard' | 'Students' | 'MarksEntry' | 'ReportCards' | 'Login';
