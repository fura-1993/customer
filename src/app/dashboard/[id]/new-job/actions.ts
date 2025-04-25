'use server';

import { getSupabaseServer } from '@/lib/supabaseService';
import { JobFormValues } from '@/lib/validators';

export async function createOrUpdateJob(data: JobFormValues, id?: string) {
  const supabase = getSupabaseServer();
  
  try {
    if (id) {
      const { error } = await supabase
        .from('jobs')
        .update({
          site_address: data.site_address,
          description: data.description,
          start_date: data.start_date.toISOString(),
          end_date: data.end_date ? data.end_date.toISOString() : null,
          amount: data.amount,
          periodic: data.periodic,
          memo: data.memo,
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true, id };
    } else {
      const { data: newJob, error } = await supabase
        .from('jobs')
        .insert({
          customer_id: data.customer_id,
          site_address: data.site_address,
          description: data.description,
          start_date: data.start_date.toISOString(),
          end_date: data.end_date ? data.end_date.toISOString() : null,
          amount: data.amount,
          periodic: data.periodic,
          memo: data.memo,
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      return { success: true, id: newJob.id };
    }
  } catch (error) {
    console.error('案件データの保存エラー:', error);
    return { success: false };
  }
}
