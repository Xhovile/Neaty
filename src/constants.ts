import { Grade, Student, Subject, Mark } from './types';

export const CLASSES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
export const TERMS = ['Term 1', 'Term 2', 'Term 3'];

export const SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics' },
  { id: '2', name: 'English Language' },
  { id: '3', name: 'Science' },
  { id: '4', name: 'Social Studies' },
  { id: '5', name: 'Physical Education' },
  { id: '6', name: 'Art' },
  { id: '7', name: 'Computer Science' },
  { id: '8', name: 'History' },
];

export const DEMO_STUDENTS: Student[] = [
  { id: '1', fullName: 'John Doe', admissionNumber: 'ADM-001', gender: 'Male', class: 'Grade 10', term: 'Term 1' },
  { id: '2', fullName: 'Jane Smith', admissionNumber: 'ADM-002', gender: 'Female', class: 'Grade 10', term: 'Term 1' },
  { id: '3', fullName: 'Alice Johnson', admissionNumber: 'ADM-003', gender: 'Female', class: 'Grade 11', term: 'Term 1' },
  { id: '4', fullName: 'Bob Brown', admissionNumber: 'ADM-004', gender: 'Male', class: 'Grade 11', term: 'Term 1' },
];

export const calculateGrade = (total: number): { grade: Grade; remark: string } => {
  if (total >= 80) return { grade: 'A', remark: 'Excellent' };
  if (total >= 70) return { grade: 'B', remark: 'Very Good' };
  if (total >= 60) return { grade: 'C', remark: 'Good' };
  if (total >= 50) return { grade: 'D', remark: 'Pass' };
  return { grade: 'F', remark: 'Fail' };
};

export const DEMO_MARKS: Mark[] = [
  {
    id: '1',
    studentId: '1',
    subjectId: '1',
    test1: 15,
    test2: 15,
    exam: 60,
    total: 90,
    average: 90,
    grade: 'A',
    remark: 'Excellent',
  },
  {
    id: '2',
    studentId: '1',
    subjectId: '2',
    test1: 12,
    test2: 13,
    exam: 50,
    total: 75,
    average: 75,
    grade: 'B',
    remark: 'Very Good',
  },
  {
    id: '3',
    studentId: '2',
    subjectId: '1',
    test1: 10,
    test2: 10,
    exam: 45,
    total: 65,
    average: 65,
    grade: 'C',
    remark: 'Good',
  },
];
