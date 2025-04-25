import { createBrowserClient } from "@supabase/ssr";
import { Database } from '@/types';

export const createClient = () => 
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export const supabaseClient = createClient();

export const getSignedUrl = async (path: string) => {
  const { data } = await supabaseClient.storage
    .from('assets')
    .createSignedUrl(path, 15 * 60); // 15分間有効

  return data?.signedUrl;
};
