import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types';

export const supabaseClient = createClientComponentClient<Database>({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export const getSignedUrl = async (path: string) => {
  const { data } = await supabaseClient.storage
    .from('private')
    .createSignedUrl(path, 15 * 60); // 15分間有効

  return data?.signedUrl;
};
