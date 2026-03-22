import { Session } from '@supabase/supabase-js';
import { School, User, UserRole } from '../../domain/school/types';
import { getSupabaseBrowserClient } from './browser-client';

interface AppUserRow {
  id: string;
  school_id: string;
  full_name: string | null;
  role: UserRole;
}

interface SchoolRow {
  id: string;
  name: string;
  motto: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
}

const mapSchool = (row: SchoolRow): School => ({
  id: row.id,
  name: row.name,
  motto: row.motto ?? undefined,
  address: row.address ?? undefined,
  phone: row.phone ?? undefined,
  email: row.email ?? undefined,
  logoUrl: row.logo_url ?? undefined,
});

const mapUser = (session: Session, profile: AppUserRow): User => ({
  id: profile.id,
  username: profile.full_name || session.user.email || 'User',
  email: session.user.email,
  fullName: profile.full_name ?? undefined,
  role: profile.role,
  schoolId: profile.school_id,
});

export const signInWithPassword = async (email: string, password: string) => {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
  return data;
};

export const signOutCurrentUser = async () => {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const getCurrentSession = async () => {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
};

export const fetchAuthenticatedProfile = async (session: Session): Promise<{ user: User; school: School }> => {
  const supabase = getSupabaseBrowserClient();
  const { data: profile, error: profileError } = await supabase
    .from('app_users')
    .select('id, school_id, full_name, role')
    .eq('id', session.user.id)
    .single<AppUserRow>();

  if (profileError || !profile) {
    throw profileError ?? new Error('No app user profile found for this account.');
  }

  const { data: school, error: schoolError } = await supabase
    .from('schools')
    .select('id, name, motto, address, phone, email, logo_url')
    .eq('id', profile.school_id)
    .single<SchoolRow>();

  if (schoolError || !school) {
    throw schoolError ?? new Error('No school record found for this account.');
  }

  return {
    user: mapUser(session, profile),
    school: mapSchool(school),
  };
};

export const onAuthStateChanged = (callback: (session: Session | null) => void) => {
  const supabase = getSupabaseBrowserClient();
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => {
    data.subscription.unsubscribe();
  };
};
