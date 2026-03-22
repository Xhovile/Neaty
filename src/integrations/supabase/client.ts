import { assertSupabaseEnv, isSupabaseConfigured } from '../../lib/env';
import { getSupabaseBrowserClient } from './browser-client';

export interface SupabaseRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

const buildHeaders = async (headers: Record<string, string> = {}) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured for this environment.');
  }

  const { supabaseAnonKey } = assertSupabaseEnv();
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${accessToken ?? supabaseAnonKey}`,
    'Content-Type': 'application/json',
    ...headers,
  };
};

export const supabaseRestRequest = async <T>(path: string, options: SupabaseRequestOptions = {}): Promise<T> => {
  const { supabaseUrl } = assertSupabaseEnv();
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method: options.method ?? 'GET',
    headers: await buildHeaders(options.headers),
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${errorText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
