export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          motto: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          motto?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['schools']['Insert']>;
      };
      app_users: {
        Row: {
          id: string;
          school_id: string;
          full_name: string | null;
          role: 'Admin' | 'Teacher' | 'HeadTeacher';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          school_id: string;
          full_name?: string | null;
          role: 'Admin' | 'Teacher' | 'HeadTeacher';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['app_users']['Insert']>;
      };
      academic_years: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          is_current: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          is_current?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['academic_years']['Insert']>;
      };
      terms: {
        Row: {
          id: string;
          school_id: string;
          academic_year_id: string;
          name: string;
          is_current: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          academic_year_id: string;
          name: string;
          is_current?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['terms']['Insert']>;
      };
      classes: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['classes']['Insert']>;
      };
      streams: {
        Row: {
          id: string;
          school_id: string;
          class_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          class_id: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['streams']['Insert']>;
      };
      subjects: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          code?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['subjects']['Insert']>;
      };
      students: {
        Row: {
          id: string;
          school_id: string;
          full_name: string;
          admission_number: string;
          gender: 'Male' | 'Female' | 'Other';
          date_of_birth: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          full_name: string;
          admission_number: string;
          gender: 'Male' | 'Female' | 'Other';
          date_of_birth?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['students']['Insert']>;
      };
      enrollments: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          academic_year_id: string;
          class_id: string;
          stream_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          academic_year_id: string;
          class_id: string;
          stream_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>;
      };
      assessment_components: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          weight: number;
          max_score: number;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          weight: number;
          max_score: number;
          display_order?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['assessment_components']['Insert']>;
      };
      grade_scales: {
        Row: {
          id: string;
          school_id: string;
          min_score: number;
          max_score: number;
          grade: string;
          remark: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          min_score: number;
          max_score: number;
          grade: string;
          remark: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['grade_scales']['Insert']>;
      };
      marks: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          subject_id: string;
          term_id: string;
          academic_year_id: string;
          created_by: string | null;
          scores: Json;
          weighted_total: number;
          grade: string;
          remark: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          subject_id: string;
          term_id: string;
          academic_year_id: string;
          created_by?: string | null;
          scores?: Json;
          weighted_total?: number;
          grade: string;
          remark: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['marks']['Insert']>;
      };
    };
  };
}
