import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isAdminEmail } from '@/lib/supabaseService';

export async function GET() {
  const supabase = getSupabaseAdmin();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user.email || !isAdminEmail(session.user.email)) {
    return new NextResponse('Unauthorized', { status: 403 });
  }
  
  const { data: assets, error } = await supabase
    .from('assets')
    .select(`
      *,
      jobs (
        description,
        customer_id,
        customers (
          name
        )
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('アセットデータの取得エラー:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
  
  const headers = ['ID', '顧客名', '案件内容', 'ファイル種類', 'ファイル名', 'URL', '作成日'];
  
  const csvRows = [
    headers.join(','),
    ...assets.map(asset => [
      asset.id,
      `"${asset.jobs?.customers?.name?.replace(/"/g, '""') || ''}"`,
      `"${asset.jobs?.description?.replace(/"/g, '""') || ''}"`,
      getAssetTypeLabel(asset.type),
      `"${asset.filename.replace(/"/g, '""')}"`,
      asset.url,
      new Date(asset.created_at).toLocaleString('ja-JP')
    ].join(','))
  ];
  
  const csv = csvRows.join('\n');
  
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename=assets.csv'
    }
  });
}

function getAssetTypeLabel(type: string): string {
  switch (type) {
    case 'before':
      return '作業前写真';
    case 'after':
      return '作業後写真';
    case 'scene':
      return '作業風景写真';
    case 'doc':
      return '書類';
    case 'video':
      return '動画';
    default:
      return type;
  }
}
