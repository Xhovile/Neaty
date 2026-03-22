import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { assertSupabaseEnv, isSupabaseConfigured } from '../../lib/env';
import { Database } from './database.types';

let browserClient: SupabaseClient<Database> | null = null;

export const getSupabaseBrowserClient = (): SupabaseClient<Database> => {
  if (browserClient) {
    return browserClient;
  }

  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const { supabaseUrl, supabaseAnonKey } = assertSupabaseEnv();
  browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
};
