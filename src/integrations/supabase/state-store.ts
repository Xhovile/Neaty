import { Class, AcademicYear, Stream, Subject, Term } from '../../domain/academics/types';
import { AssessmentComponent, GradeScale } from '../../domain/assessments/types';
import { MarkEntry } from '../../domain/reports/types';
import { School } from '../../domain/school/types';
import { Enrollment, Student } from '../../domain/students/types';
import { AppState } from '../../state/app-store';
import { supabaseRestRequest } from './client';
import { Database, Json } from './database.types';

type TableName = keyof Database['public']['Tables'];
type RowOf<T extends TableName> = Database['public']['Tables'][T]['Row'];
type InsertOf<T extends TableName> = Database['public']['Tables'][T]['Insert'];

type SchoolRow = RowOf<'schools'>;
type AcademicYearRow = RowOf<'academic_years'>;
type TermRow = RowOf<'terms'>;
type ClassRow = RowOf<'classes'>;
type StreamRow = RowOf<'streams'>;
type SubjectRow = RowOf<'subjects'>;
type StudentRow = RowOf<'students'>;
type EnrollmentRow = RowOf<'enrollments'>;
type AssessmentComponentRow = RowOf<'assessment_components'>;
type GradeScaleRow = RowOf<'grade_scales'>;
type MarkRow = RowOf<'marks'>;

const buildPath = (table: string, params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams(params);
  return `${table}?${searchParams.toString()}`;
};

const readRows = async <T extends TableName>(table: T, params: Record<string, string> = {}): Promise<RowOf<T>[]> => {
  return supabaseRestRequest<RowOf<T>[]>(buildPath(table, { select: '*', ...params }));
};

const insertRows = async <T extends TableName>(table: T, rows: InsertOf<T>[]): Promise<RowOf<T>[]> => {
  if (rows.length === 0) {
    return [];
  }

  return supabaseRestRequest<RowOf<T>[]>(buildPath(table, { select: '*' }), {
    method: 'POST',
    headers: {
      Prefer: 'return=representation',
    },
    body: rows,
  });
};

const upsertRows = async <T extends TableName>(table: T, rows: InsertOf<T>[], onConflict: string): Promise<RowOf<T>[]> => {
  if (rows.length === 0) {
    return [];
  }

  return supabaseRestRequest<RowOf<T>[]>(buildPath(table, { select: '*', on_conflict: onConflict }), {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: rows,
  });
};

const patchRows = async <T extends TableName>(table: T, filters: Record<string, string>, payload: Partial<InsertOf<T>>): Promise<RowOf<T>[]> => {
  return supabaseRestRequest<RowOf<T>[]>(buildPath(table, { select: '*', ...filters }), {
    method: 'PATCH',
    headers: {
      Prefer: 'return=representation',
    },
    body: payload,
  });
};

const firstSchool = async (): Promise<SchoolRow | undefined> => {
  const schools = await readRows('schools', { order: 'created_at.asc', limit: '1' });
  return schools[0];
};

const mapSchool = (row: SchoolRow): School => ({
  id: row.id,
  name: row.name,
  motto: row.motto ?? undefined,
  address: row.address ?? undefined,
  phone: row.phone ?? undefined,
  email: row.email ?? undefined,
  logoUrl: row.logo_url ?? undefined,
});

const mapAcademicYear = (row: AcademicYearRow): AcademicYear => ({
  id: row.id,
  name: row.name,
  isCurrent: row.is_current,
});

const mapTerm = (row: TermRow): Term => ({
  id: row.id,
  academicYearId: row.academic_year_id,
  name: row.name,
  isCurrent: row.is_current,
});

const mapClass = (row: ClassRow): Class => ({
  id: row.id,
  name: row.name,
});

const mapStream = (row: StreamRow): Stream => ({
  id: row.id,
  classId: row.class_id,
  name: row.name,
});

const mapSubject = (row: SubjectRow): Subject => ({
  id: row.id,
  name: row.name,
  code: row.code ?? undefined,
});

const mapStudent = (row: StudentRow): Student => ({
  id: row.id,
  fullName: row.full_name,
  admissionNumber: row.admission_number,
  gender: row.gender,
  dateOfBirth: row.date_of_birth ?? undefined,
});

const mapEnrollment = (row: EnrollmentRow): Enrollment => ({
  id: row.id,
  studentId: row.student_id,
  academicYearId: row.academic_year_id,
  classId: row.class_id,
  streamId: row.stream_id ?? '',
});

const mapAssessmentComponent = (row: AssessmentComponentRow): AssessmentComponent => ({
  id: row.id,
  name: row.name,
  weight: Number(row.weight),
  maxScore: Number(row.max_score),
});

const mapGradeScale = (row: GradeScaleRow): GradeScale => ({
  id: row.id,
  minScore: Number(row.min_score),
  maxScore: Number(row.max_score),
  grade: row.grade,
  remark: row.remark,
});

const jsonToScores = (value: Json): Record<string, number> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce<Record<string, number>>((acc, [key, score]) => {
    acc[key] = typeof score === 'number' ? score : Number(score ?? 0);
    return acc;
  }, {});
};

const mapMark = (row: MarkRow): MarkEntry => ({
  id: row.id,
  studentId: row.student_id,
  subjectId: row.subject_id,
  termId: row.term_id,
  academicYearId: row.academic_year_id,
  scores: jsonToScores(row.scores),
  weightedTotal: Number(row.weighted_total),
  grade: row.grade,
  remark: row.remark,
});

const schoolPayload = (school: School): InsertOf<'schools'> => ({
  name: school.name,
  motto: school.motto ?? null,
  address: school.address ?? null,
  phone: school.phone ?? null,
  email: school.email ?? null,
  logo_url: school.logoUrl ?? null,
});

const schoolScoped = (schoolId: string) => ({ school_id: `eq.${schoolId}` });
const termKey = (academicYearName: string, termName: string) => `${academicYearName}::${termName}`;
const streamKey = (className: string, streamName: string) => `${className}::${streamName}`;
const subjectKey = (subject: Pick<Subject, 'name' | 'code'>) => subject.code?.trim() || subject.name;

const ensureSchool = async (school: School): Promise<SchoolRow> => {
  const existingSchool = await firstSchool();

  if (!existingSchool) {
    const created = await insertRows('schools', [schoolPayload(school)]);
    return created[0];
  }

  const updated = await patchRows('schools', { id: `eq.${existingSchool.id}` }, schoolPayload(school));
  return updated[0] ?? existingSchool;
};

export const loadRemoteState = async (): Promise<Partial<AppState> | undefined> => {
  const school = await firstSchool();
  if (!school) {
    return undefined;
  }

  const filter = schoolScoped(school.id);

  const [
    academicYearRows,
    termRows,
    classRows,
    streamRows,
    subjectRows,
    studentRows,
    enrollmentRows,
    assessmentRows,
    gradeScaleRows,
    markRows,
  ] = await Promise.all([
    readRows('academic_years', { ...filter, order: 'created_at.asc' }),
    readRows('terms', { ...filter, order: 'created_at.asc' }),
    readRows('classes', { ...filter, order: 'created_at.asc' }),
    readRows('streams', { ...filter, order: 'created_at.asc' }),
    readRows('subjects', { ...filter, order: 'created_at.asc' }),
    readRows('students', { ...filter, order: 'created_at.asc' }),
    readRows('enrollments', { ...filter, order: 'created_at.asc' }),
    readRows('assessment_components', { ...filter, order: 'display_order.asc' }),
    readRows('grade_scales', { ...filter, order: 'min_score.desc' }),
    readRows('marks', { ...filter, order: 'updated_at.desc' }),
  ]);

  return {
    school: mapSchool(school),
    academicYears: academicYearRows.map(mapAcademicYear),
    terms: termRows.map(mapTerm),
    classes: classRows.map(mapClass),
    streams: streamRows.map(mapStream),
    subjects: subjectRows.map(mapSubject),
    students: studentRows.map(mapStudent),
    enrollments: enrollmentRows.map(mapEnrollment),
    assessmentComponents: assessmentRows.map(mapAssessmentComponent),
    gradeScale: gradeScaleRows.map(mapGradeScale),
    marks: markRows.map(mapMark),
  };
};

export const saveRemoteState = async (state: AppState): Promise<boolean> => {
  const school = await ensureSchool(state.school);
  const schoolId = school.id;

  const academicYearRows = await upsertRows('academic_years', state.academicYears.map(item => ({
    school_id: schoolId,
    name: item.name,
    is_current: item.isCurrent,
  })), 'school_id,name');

  const academicYearNameByLocalId = new Map(state.academicYears.map(item => [item.id, item.name]));
  const academicYearIdByName = new Map(academicYearRows.map(item => [item.name, item.id]));

  const classRows = await upsertRows('classes', state.classes.map(item => ({
    school_id: schoolId,
    name: item.name,
  })), 'school_id,name');

  const classNameByLocalId = new Map(state.classes.map(item => [item.id, item.name]));
  const classIdByName = new Map(classRows.map(item => [item.name, item.id]));
  const classNameByRemoteId = new Map(classRows.map(item => [item.id, item.name]));

  const subjectRows = await upsertRows('subjects', state.subjects.map(item => ({
    school_id: schoolId,
    name: item.name,
    code: item.code ?? null,
  })), 'school_id,name');

  const subjectByLocalId = new Map(state.subjects.map(item => [item.id, item]));
  const subjectIdByKey = new Map(subjectRows.map(item => [(item.code ?? item.name), item.id]));

  const studentRows = await upsertRows('students', state.students.map(item => ({
    school_id: schoolId,
    full_name: item.fullName,
    admission_number: item.admissionNumber,
    gender: item.gender,
    date_of_birth: item.dateOfBirth ?? null,
  })), 'school_id,admission_number');

  const studentByLocalId = new Map(state.students.map(item => [item.id, item]));
  const studentIdByAdmission = new Map(studentRows.map(item => [item.admission_number, item.id]));

  const termRows = await upsertRows('terms', state.terms.flatMap(item => {
    const academicYearName = academicYearNameByLocalId.get(item.academicYearId);
    const academicYearId = academicYearName ? academicYearIdByName.get(academicYearName) : undefined;
    if (!academicYearId) {
      return [];
    }

    return [{
      school_id: schoolId,
      academic_year_id: academicYearId,
      name: item.name,
      is_current: item.isCurrent,
    }];
  }), 'academic_year_id,name');

  const termByLocalId = new Map(state.terms.map(item => [item.id, item]));
  const termIdByKey = new Map(termRows.map(item => [termKey(academicYearNameByLocalId.get(item.academic_year_id) ?? classNameByRemoteId.get(item.academic_year_id) ?? item.academic_year_id, item.name), item.id]));
  const academicYearNameByRemoteId = new Map(academicYearRows.map(item => [item.id, item.name]));
  const normalizedTermIdByKey = new Map(termRows.map(item => [termKey(academicYearNameByRemoteId.get(item.academic_year_id) ?? item.academic_year_id, item.name), item.id]));

  const streamRows = await upsertRows('streams', state.streams.flatMap(item => {
    const className = classNameByLocalId.get(item.classId);
    const classId = className ? classIdByName.get(className) : undefined;
    if (!classId) {
      return [];
    }

    return [{
      school_id: schoolId,
      class_id: classId,
      name: item.name,
    }];
  }), 'class_id,name');

  const streamByLocalId = new Map(state.streams.map(item => [item.id, item]));
  const streamIdByKey = new Map(streamRows.map(item => [streamKey(classNameByRemoteId.get(item.class_id) ?? item.class_id, item.name), item.id]));

  await upsertRows('assessment_components', state.assessmentComponents.map((item, index) => ({
    school_id: schoolId,
    name: item.name,
    weight: item.weight,
    max_score: item.maxScore,
    display_order: index,
  })), 'school_id,name');

  await upsertRows('grade_scales', state.gradeScale.map(item => ({
    school_id: schoolId,
    min_score: item.minScore,
    max_score: item.maxScore,
    grade: item.grade,
    remark: item.remark,
  })), 'school_id,grade');

  await upsertRows('enrollments', state.enrollments.flatMap(item => {
    const localStudent = studentByLocalId.get(item.studentId);
    const academicYearName = academicYearNameByLocalId.get(item.academicYearId);
    const className = classNameByLocalId.get(item.classId);
    const localStream = item.streamId ? streamByLocalId.get(item.streamId) : undefined;

    const studentId = localStudent ? studentIdByAdmission.get(localStudent.admissionNumber) : undefined;
    const academicYearId = academicYearName ? academicYearIdByName.get(academicYearName) : undefined;
    const classId = className ? classIdByName.get(className) : undefined;
    const streamId = localStream && className ? streamIdByKey.get(streamKey(className, localStream.name)) : null;

    if (!studentId || !academicYearId || !classId) {
      return [];
    }

    return [{
      school_id: schoolId,
      student_id: studentId,
      academic_year_id: academicYearId,
      class_id: classId,
      stream_id: streamId ?? null,
    }];
  }), 'student_id,academic_year_id');

  await upsertRows('marks', state.marks.flatMap(item => {
    const localStudent = studentByLocalId.get(item.studentId);
    const localSubject = subjectByLocalId.get(item.subjectId);
    const localTerm = termByLocalId.get(item.termId);
    const academicYearName = academicYearNameByLocalId.get(item.academicYearId) ?? (localTerm ? academicYearNameByLocalId.get(localTerm.academicYearId) : undefined);

    const studentId = localStudent ? studentIdByAdmission.get(localStudent.admissionNumber) : undefined;
    const subjectId = localSubject ? subjectIdByKey.get(subjectKey(localSubject)) : undefined;
    const termId = localTerm && academicYearName ? normalizedTermIdByKey.get(termKey(academicYearName, localTerm.name)) : undefined;
    const academicYearId = academicYearName ? academicYearIdByName.get(academicYearName) : undefined;

    if (!studentId || !subjectId || !termId || !academicYearId) {
      return [];
    }

    return [{
      school_id: schoolId,
      student_id: studentId,
      subject_id: subjectId,
      term_id: termId,
      academic_year_id: academicYearId,
      scores: item.scores as Json,
      weighted_total: item.weightedTotal,
      grade: item.grade,
      remark: item.remark,
    }];
  }), 'student_id,subject_id,term_id,academic_year_id');

  return true;
};
