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
