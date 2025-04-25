import { createServerClient } from "@supabase/ssr";
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/types';

export const getSupabaseServer = () => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookies().get(name)?.value;
        },
        set(name, value, options) {
          cookies().set(name, value, options);
        },
        remove(name, options) {
          cookies().set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
};

export const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
};

export const isAdminEmail = (email: string) => {
  return email === process.env.ADMIN_EMAIL;
};
