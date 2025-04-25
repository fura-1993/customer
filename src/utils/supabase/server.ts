import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from '../../types';

export const createClient = () => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookieStore = cookies();
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            const cookieStore = cookies();
            cookieStore.set(name, value, options);
          } catch {
          }
        },
        remove(name, options) {
          try {
            const cookieStore = cookies();
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          } catch {
          }
        },
      },
    }
  );
};
