import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSupabaseServer } from '@/lib/supabaseService';

export const metadata: Metadata = {
  title: '顧客一覧 | 顧客管理システム',
  description: '顧客一覧ページです',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = getSupabaseServer();
  
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('顧客データの取得エラー:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">顧客一覧</h1>
        <Link href="/dashboard/new-customer" passHref>
          <Button>新規顧客登録</Button>
        </Link>
      </div>
      
      {customers && customers.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {customers.map((customer) => (
            <Link
              key={customer.id}
              href={`/dashboard/${customer.id}`}
              className="block"
            >
              <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <h2 className="text-xl font-semibold">{customer.name}</h2>
                <p className="text-muted-foreground">{customer.address}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold">顧客データがありません</h2>
          <p className="text-muted-foreground mt-2">
            新規顧客登録ボタンから顧客を追加してください
          </p>
        </div>
      )}
    </div>
  );
}
