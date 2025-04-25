import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { Database } from '../../types';

export const createClient = (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name) {
          return request.cookies.get(name)?.value;
        },
        async set(name, value, options) {
          request.cookies.set(name, value);
          response = NextResponse.next({
            request,
          });
          response.cookies.set(name, value, options);
        },
        async remove(name, options) {
          request.cookies.set(name, '');
          response = NextResponse.next({
            request,
          });
          response.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  return { supabase, response };
};
