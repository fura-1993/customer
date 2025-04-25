import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin, isAdminEmail } from '@/lib/supabaseService';

export async function GET() {
  const cookieStore = cookies();
  const supabase = getSupabaseAdmin();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user.email || !isAdminEmail(session.user.email)) {
    return new NextResponse('Unauthorized', { status: 403 });
  }
  
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select(`
      *,
      customers (
        name
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('案件データの取得エラー:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
  
  const headers = ['ID', '顧客名', '現場住所', '作業内容', '開始日', '終了日', '金額', '定期', 'メモ', '作成日', '更新日'];
  
  const csvRows = [
    headers.join(','),
    ...jobs.map(job => [
      job.id,
      `"${job.customers?.name?.replace(/"/g, '""') || ''}"`,
      `"${job.site_address.replace(/"/g, '""')}"`,
      `"${job.description.replace(/"/g, '""')}"`,
      new Date(job.start_date).toLocaleDateString('ja-JP'),
      job.end_date ? new Date(job.end_date).toLocaleDateString('ja-JP') : '',
      job.amount.toLocaleString(),
      job.periodic ? 'あり' : 'なし',
      job.memo ? `"${job.memo.replace(/"/g, '""')}"` : '',
      new Date(job.created_at).toLocaleString('ja-JP'),
      new Date(job.updated_at).toLocaleString('ja-JP')
    ].join(','))
  ];
  
  const csv = csvRows.join('\n');
  
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename=jobs.csv'
    }
  });
}
