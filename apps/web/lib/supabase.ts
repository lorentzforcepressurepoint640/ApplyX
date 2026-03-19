import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Please define the SUPABASE_URL and SUPABASE_ANON_KEY environment variables inside .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
