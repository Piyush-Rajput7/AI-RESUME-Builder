import { createClient } from '@supabase/supabase-js';

const globalForSupabase = globalThis as unknown as { __supabase?: ReturnType<typeof createClient> };

export const supabase =
  globalForSupabase.__supabase ||
  createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );

if (import.meta.env.DEV) {
  globalForSupabase.__supabase = supabase;
}

