import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isAdminEmail } from '@/lib/supabaseService';

export async function GET() {
  const supabase = getSupabaseAdmin();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user.email || !isAdminEmail(session.user.email)) {
    return new NextResponse('Unauthorized', { status: 403 });
  }
  
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('顧客データの取得エラー:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
  
  const headers = ['ID', '顧客名', '住所', '作成日', '更新日'];
  
  const csvRows = [
    headers.join(','),
    ...customers.map(customer => [
      customer.id,
      `"${customer.name.replace(/"/g, '""')}"`,
      `"${customer.address.replace(/"/g, '""')}"`,
      new Date(customer.created_at).toLocaleString('ja-JP'),
      new Date(customer.updated_at).toLocaleString('ja-JP')
    ].join(','))
  ];
  
  const csv = csvRows.join('\n');
  
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename=customers.csv'
    }
  });
}
