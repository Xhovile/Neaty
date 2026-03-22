const readEnv = (key: string): string | undefined => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  return undefined;
};

export const env = {
  supabaseUrl: readEnv('VITE_SUPABASE_URL'),
  supabaseAnonKey: readEnv('VITE_SUPABASE_ANON_KEY'),
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
};

export const assertSupabaseEnv = (): { supabaseUrl: string; supabaseAnonKey: string } => {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error('Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  return {
    supabaseUrl: env.supabaseUrl,
    supabaseAnonKey: env.supabaseAnonKey,
  };
};
