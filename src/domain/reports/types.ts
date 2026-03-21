export type Grade = string;

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
