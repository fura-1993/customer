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
        async get(name) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name, value, options) {
          const cookieStore = await cookies();
          cookieStore.set(name, value, options);
        },
        async remove(name, options) {
          const cookieStore = await cookies();
          cookieStore.set(name, '', { ...options, maxAge: 0 });
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
