import { 
  School, AcademicYear, Term, Class, Stream, Subject, Student, 
  Enrollment, AssessmentComponent, GradeScale, MarkEntry 
} from './types';

export const DEMO_SCHOOL: School = {
  id: 's1',
  name: 'Neaty Academy',
  motto: 'Excellence in Every Detail',
  address: '123 Innovation Drive, Tech City',
  phone: '+1 234 567 890',
  email: 'hello@neaty.edu',
};

export const DEMO_ACADEMIC_YEARS: AcademicYear[] = [
  { id: 'ay1', name: '2024/2025', isCurrent: true },
];

export const DEMO_TERMS: Term[] = [
  { id: 't1', academicYearId: 'ay1', name: 'Term 1', isCurrent: true },
  { id: 't2', academicYearId: 'ay1', name: 'Term 2', isCurrent: false },
  { id: 't3', academicYearId: 'ay1', name: 'Term 3', isCurrent: false },
];

export const DEMO_CLASSES: Class[] = [
  { id: 'c1', name: 'Grade 10' },
  { id: 'c2', name: 'Grade 11' },
];

export const DEMO_STREAMS: Stream[] = [
  { id: 'st1', classId: 'c1', name: 'Science' },
  { id: 'st2', classId: 'c1', name: 'Arts' },
  { id: 'st3', classId: 'c2', name: 'Science' },
];

export const DEMO_SUBJECTS: Subject[] = [
  { id: 'sub1', name: 'Mathematics', code: 'MATH101' },
  { id: 'sub2', name: 'English', code: 'ENG101' },
  { id: 'sub3', name: 'Physics', code: 'PHY101' },
  { id: 'sub4', name: 'History', code: 'HIS101' },
];

export const DEMO_STUDENTS: Student[] = [
  { id: 'stu1', fullName: 'Alice Wonder', admissionNumber: 'N-001', gender: 'Female' },
  { id: 'stu2', fullName: 'Bob Builder', admissionNumber: 'N-002', gender: 'Male' },
  { id: 'stu3', fullName: 'Charlie Brown', admissionNumber: 'N-003', gender: 'Male' },
];

export const DEMO_ENROLLMENTS: Enrollment[] = [
  { id: 'e1', studentId: 'stu1', academicYearId: 'ay1', classId: 'c1', streamId: 'st1' },
  { id: 'e2', studentId: 'stu2', academicYearId: 'ay1', classId: 'c1', streamId: 'st1' },
  { id: 'e3', studentId: 'stu3', academicYearId: 'ay1', classId: 'c2', streamId: 'st3' },
];

export const DEMO_ASSESSMENT_COMPONENTS: AssessmentComponent[] = [
  { id: 'ac1', name: 'Test 1', weight: 20, maxScore: 20 },
  { id: 'ac2', name: 'Test 2', weight: 20, maxScore: 20 },
  { id: 'ac3', name: 'Final Exam', weight: 60, maxScore: 100 },
];

export const DEMO_GRADE_SCALE: GradeScale[] = [
  { id: 'gs1', minScore: 80, maxScore: 100, grade: 'A', remark: 'Excellent' },
  { id: 'gs2', minScore: 70, maxScore: 79, grade: 'B', remark: 'Very Good' },
  { id: 'gs3', minScore: 60, maxScore: 69, grade: 'C', remark: 'Good' },
  { id: 'gs4', minScore: 50, maxScore: 59, grade: 'D', remark: 'Pass' },
  { id: 'gs5', minScore: 0, maxScore: 49, grade: 'F', remark: 'Fail' },
];

export const calculateWeightedTotal = (scores: { [componentId: string]: number }, components: AssessmentComponent[]): number => {
  let total = 0;
  components.forEach(comp => {
    const score = scores[comp.id] || 0;
    // Calculate weighted contribution: (score / maxScore) * weight
    total += (score / comp.maxScore) * comp.weight;
  });
  return Math.round(total * 100) / 100;
};

export const getGradeFromScale = (total: number, scale: GradeScale[]): { grade: string; remark: string } => {
  const found = scale.find(s => total >= s.minScore && total <= s.maxScore);
  return found ? { grade: found.grade, remark: found.remark } : { grade: 'N/A', remark: 'No Grade' };
};
