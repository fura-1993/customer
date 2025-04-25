import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from '../../types';

export const createClient = async () => {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name) {
          return cookieStore.get(name)?.value;
        },
        async set(name, value, options) {
          cookieStore.set(name, value, options);
        },
        async remove(name, options) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
};
