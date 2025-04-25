'use server';

import { getSupabaseServer } from '@/lib/supabaseService';

interface Worker {
  id: string;
  job_id: string;
  name: string;
  created_at: string;
}

export async function saveWorkers(
  jobId: string, 
  workers: { name: string }[],
  initialWorkers: Worker[]
) {
  const supabase = getSupabaseServer();
  
  try {
    if (initialWorkers.length > 0) {
      const { error: deleteError } = await supabase
        .from('workers')
        .delete()
        .eq('job_id', jobId);
      
      if (deleteError) throw deleteError;
    }
    
    if (workers.length > 0) {
      const workersToInsert = workers
        .filter(worker => worker.name.trim() !== '')
        .map(worker => ({
          job_id: jobId,
          name: worker.name.trim(),
        }));
      
      if (workersToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('workers')
          .insert(workersToInsert);
        
        if (insertError) throw insertError;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('作業員データの保存エラー:', error);
    return { success: false };
  }
}
