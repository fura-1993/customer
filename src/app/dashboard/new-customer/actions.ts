'use server';

import { getSupabaseServer } from '../../../lib/supabaseService';
import { CustomerFormValues } from '../../../lib/validators';

export async function createOrUpdateCustomer(data: CustomerFormValues, id?: string) {
  const supabase = getSupabaseServer();
  
  try {
    if (id) {
      const { error } = await supabase
        .from('customers')
        .update({
          name: data.name,
          address: data.address,
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true, id };
    } else {
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert({
          name: data.name,
          address: data.address,
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      return { success: true, id: newCustomer.id };
    }
  } catch (error) {
    console.error('顧客データの保存エラー:', error);
    return { success: false };
  }
}
