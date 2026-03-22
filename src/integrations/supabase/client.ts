import { assertSupabaseEnv, isSupabaseConfigured } from '../../lib/env';

export interface SupabaseRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

const buildHeaders = (headers: Record<string, string> = {}) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured for this environment.');
  }

  const { supabaseAnonKey } = assertSupabaseEnv();

  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    ...headers,
  };
};

export const supabaseRestRequest = async <T>(path: string, options: SupabaseRequestOptions = {}): Promise<T> => {
  const { supabaseUrl } = assertSupabaseEnv();
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method: options.method ?? 'GET',
    headers: buildHeaders(options.headers),
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
