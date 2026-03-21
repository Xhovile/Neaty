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
