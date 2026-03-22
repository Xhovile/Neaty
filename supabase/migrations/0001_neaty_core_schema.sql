create extension if not exists pgcrypto;

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  motto text,
  address text,
  phone text,
  email text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  full_name text,
  role text not null check (role in ('Admin', 'Teacher', 'HeadTeacher')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, school_id)
);

create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  unique (school_id, name)
);

create table if not exists public.terms (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id) on delete cascade,
  name text not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  unique (academic_year_id, name)
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (school_id, name)
);

create table if not exists public.streams (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (class_id, name)
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  code text,
  created_at timestamptz not null default now(),
  unique (school_id, name),
  unique (school_id, code)
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  full_name text not null,
  admission_number text not null,
  gender text not null check (gender in ('Male', 'Female', 'Other')),
  date_of_birth date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, admission_number)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  stream_id uuid references public.streams(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (student_id, academic_year_id)
);

create table if not exists public.assessment_components (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  weight numeric(5,2) not null check (weight >= 0 and weight <= 100),
  max_score numeric(8,2) not null check (max_score > 0),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (school_id, name)
);

create table if not exists public.grade_scales (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  min_score numeric(5,2) not null,
  max_score numeric(5,2) not null,
  grade text not null,
  remark text not null,
  created_at timestamptz not null default now(),
  check (min_score <= max_score),
  unique (school_id, grade)
);

create table if not exists public.marks (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  term_id uuid not null references public.terms(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id) on delete cascade,
  created_by uuid references public.app_users(id) on delete set null,
  scores jsonb not null default '{}'::jsonb,
  weighted_total numeric(5,2) not null default 0,
  grade text not null,
  remark text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, subject_id, term_id, academic_year_id)
);

create index if not exists idx_app_users_school_id on public.app_users (school_id);
create index if not exists idx_academic_years_school_id on public.academic_years (school_id);
create index if not exists idx_terms_school_year on public.terms (school_id, academic_year_id);
create index if not exists idx_classes_school_id on public.classes (school_id);
create index if not exists idx_streams_class_id on public.streams (class_id);
create index if not exists idx_subjects_school_id on public.subjects (school_id);
create index if not exists idx_students_school_id on public.students (school_id);
create index if not exists idx_enrollments_school_year on public.enrollments (school_id, academic_year_id);
create index if not exists idx_marks_lookup on public.marks (school_id, academic_year_id, term_id, student_id);

comment on table public.schools is 'Top-level tenant record for each school using Neaty.';
comment on table public.app_users is 'Authenticated users mapped to a school and role.';
comment on table public.students is 'Students enrolled at a school.';
comment on table public.marks is 'Per-student, per-subject, per-term result entries with weighted scores.';

-- RLS policies are intentionally deferred to the next auth integration update.
-- This migration focuses on getting the relational model in place first.
