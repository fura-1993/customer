'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('jatrack_auth', '', {
    expires: new Date(0),
    path: '/',
  });
  redirect('/login');
}
