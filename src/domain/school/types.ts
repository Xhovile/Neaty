export interface School {
  id: string;
  name: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  motto?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'Admin' | 'Teacher';
  schoolId: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Teacher';
}
