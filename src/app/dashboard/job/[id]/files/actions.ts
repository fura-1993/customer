'use server';

import { getSupabaseServer } from '@/lib/supabaseService';

export async function deleteAsset(fileId: string) {
  const supabase = getSupabaseServer();
  await supabase.from('assets').delete().eq('id', fileId);
}
