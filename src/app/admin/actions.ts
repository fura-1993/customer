'use server';

import { getSupabaseAdmin } from '../../lib/supabaseService';

export async function toggleRLS(enabled: boolean) {
  const admin = getSupabaseAdmin();
  await admin.rpc('toggle_rls', { enabled });
}

export async function cleanupUnusedFiles() {
  const admin = getSupabaseAdmin();
  await admin.rpc('cleanup_unused_files');
}
