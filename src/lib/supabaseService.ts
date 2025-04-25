import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/types';

export const getSupabaseServer = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
};

export const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
};

export const isAdminEmail = (email: string) => {
  return email === process.env.ADMIN_EMAIL;
};
