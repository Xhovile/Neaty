create policy "Users can read their own profile"
on public.app_users
for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.app_users
for update
using (auth.uid() = id);

create policy "Users can read their school"
on public.schools
for select
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = schools.id
  )
);

create policy "Users can read school academic years"
on public.academic_years
for select
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = academic_years.school_id
  )
);

create policy "Admins and head teachers can manage school academic years"
on public.academic_years
for all
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = academic_years.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
)
with check (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = academic_years.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
);

create policy "Users can read school terms"
on public.terms
for select
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = terms.school_id
  )
);

create policy "Admins and head teachers can manage school terms"
on public.terms
for all
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = terms.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
)
with check (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = terms.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
);

create policy "Users can read school classes"
on public.classes
for select
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = classes.school_id
  )
);

create policy "Admins and head teachers can manage school classes"
on public.classes
for all
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = classes.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
)
with check (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = classes.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
);

create policy "Users can read school streams"
on public.streams
for select
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = streams.school_id
  )
);

create policy "Admins and head teachers can manage school streams"
on public.streams
for all
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = streams.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
)
with check (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = streams.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
);

create policy "Users can read school subjects"
on public.subjects
for select
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = subjects.school_id
  )
);

create policy "Admins and head teachers can manage school subjects"
on public.subjects
for all
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = subjects.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
)
with check (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = subjects.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
);

create policy "Users can read school students"
on public.students
for select
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = students.school_id
  )
);

create policy "Teachers, admins and head teachers can manage school students"
on public.students
for all
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = students.school_id
      and u.role in ('Admin', 'Teacher', 'HeadTeacher')
  )
)
with check (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = students.school_id
      and u.role in ('Admin', 'Teacher', 'HeadTeacher')
  )
);

create policy "Users can read school enrollments"
on public.enrollments
for select
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = enrollments.school_id
  )
);

create policy "Teachers, admins and head teachers can manage school enrollments"
on public.enrollments
for all
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = enrollments.school_id
      and u.role in ('Admin', 'Teacher', 'HeadTeacher')
  )
)
with check (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = enrollments.school_id
      and u.role in ('Admin', 'Teacher', 'HeadTeacher')
  )
);

create policy "Users can read school assessment components"
on public.assessment_components
for select
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = assessment_components.school_id
  )
);

create policy "Admins and head teachers can manage assessment components"
on public.assessment_components
for all
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = assessment_components.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
)
with check (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = assessment_components.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
);

create policy "Users can read school grade scales"
on public.grade_scales
for select
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = grade_scales.school_id
  )
);

create policy "Admins and head teachers can manage grade scales"
on public.grade_scales
for all
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = grade_scales.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
)
with check (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = grade_scales.school_id
      and u.role in ('Admin', 'HeadTeacher')
  )
);

create policy "Users can read school marks"
on public.marks
for select
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = marks.school_id
  )
);

create policy "Teachers, admins and head teachers can manage school marks"
on public.marks
for all
using (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = marks.school_id
      and u.role in ('Admin', 'Teacher', 'HeadTeacher')
  )
)
with check (
  exists (
    select 1
    from public.app_users u
    where u.id = auth.uid()
      and u.school_id = marks.school_id
      and u.role in ('Admin', 'Teacher', 'HeadTeacher')
  )
);

alter table public.app_users enable row level security;
alter table public.schools enable row level security;
alter table public.academic_years enable row level security;
alter table public.terms enable row level security;
alter table public.classes enable row level security;
alter table public.streams enable row level security;
alter table public.subjects enable row level security;
alter table public.students enable row level security;
alter table public.enrollments enable row level security;
alter table public.assessment_components enable row level security;
alter table public.grade_scales enable row level security;
alter table public.marks enable row level security;
