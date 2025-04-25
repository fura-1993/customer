import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseServer } from '@/lib/supabaseService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('jatrack_auth');
  
  if (!authCookie || authCookie.value !== 'authenticated') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  const { id } = params;
  const supabase = getSupabaseServer();
  
  const { data: asset, error: assetError } = await supabase
    .from('assets')
    .select('*')
    .eq('id', id)
    .single();
  
  if (assetError || !asset) {
    console.error('アセット取得エラー:', assetError);
    return new NextResponse('Not Found', { status: 404 });
  }
  
  const { data: signedUrl, error: signedUrlError } = await supabase
    .storage
    .from('assets')
    .createSignedUrl(asset.url, 900); // 15分間有効
  
  if (signedUrlError || !signedUrl) {
    console.error('署名付きURL生成エラー:', signedUrlError);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
  
  return NextResponse.redirect(signedUrl.signedUrl);
}
