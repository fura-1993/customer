'use server';

import { redirect } from 'next/navigation';
import { getSupabaseServer } from '../../lib/supabaseService';

export async function adminLogout() {
  const supabase = getSupabaseServer();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
