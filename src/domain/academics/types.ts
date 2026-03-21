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
