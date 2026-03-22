export interface School {
  id: string;
  name: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  motto?: string;
}

export type UserRole = 'Admin' | 'Teacher' | 'HeadTeacher';

export interface User {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  role: UserRole;
  schoolId: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}
