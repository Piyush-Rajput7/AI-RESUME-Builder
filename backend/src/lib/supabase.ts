import { createClient } from '@supabase/supabase-js';

// Centralized Supabase client (no circular deps)
export const supabase = createClient(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_ANON_KEY!
);

