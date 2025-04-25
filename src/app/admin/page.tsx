import { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabaseService';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '管理者ページ | 顧客管理システム',
  description: '顧客管理システムの管理者ページです',
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = getSupabaseAdmin();
  
  const { data: customers, error: customerError } = await supabase
    .from('customers')
    .select('id, name, address, created_at')
    .order('created_at', { ascending: false });
  
  const { data: jobs, error: jobError } = await supabase
    .from('jobs')
    .select('id, customer_id, description, start_date, amount')
    .order('created_at', { ascending: false });
  
  const { data: assets, error: assetError } = await supabase
    .from('assets')
    .select('id, job_id, type, filename')
    .order('created_at', { ascending: false });

  const { data: rlsEnabled } = await supabase
    .rpc('check_rls_enabled');

  async function toggleRLS(enabled: boolean) {
    'use server';
    const admin = getSupabaseAdmin();
    await admin.rpc('toggle_rls', { enabled });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">管理者ページ</h1>
        <form action={toggleRLS.bind(null, !rlsEnabled)}>
          <Button variant={rlsEnabled ? "destructive" : "default"}>
            RLS {rlsEnabled ? "無効化" : "有効化"}
          </Button>
        </form>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-4">顧客データ</h2>
          <p className="text-muted-foreground">登録数: {customers?.length || 0}</p>
          <div className="mt-4 flex justify-between">
            <Button variant="outline" asChild>
              <a href="/api/admin/export-customers" download>CSVダウンロード</a>
            </Button>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-4">案件データ</h2>
          <p className="text-muted-foreground">登録数: {jobs?.length || 0}</p>
          <div className="mt-4 flex justify-between">
            <Button variant="outline" asChild>
              <a href="/api/admin/export-jobs" download>CSVダウンロード</a>
            </Button>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-4">ファイルデータ</h2>
          <p className="text-muted-foreground">登録数: {assets?.length || 0}</p>
          <div className="mt-4 flex justify-between">
            <Button variant="outline" asChild>
              <a href="/api/admin/export-assets" download>CSVダウンロード</a>
            </Button>
            <form action={async () => {
              'use server';
              const admin = getSupabaseAdmin();
              await admin.rpc('cleanup_unused_files');
            }}>
              <Button variant="outline">未使用ファイル削除</Button>
            </form>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mt-8">最新データ</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">最新の顧客 (10件)</h3>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">顧客名</th>
                  <th className="p-2 text-left">住所</th>
                  <th className="p-2 text-left">登録日</th>
                </tr>
              </thead>
              <tbody>
                {customers?.slice(0, 10).map((customer) => (
                  <tr key={customer.id} className="border-t">
                    <td className="p-2">{customer.name}</td>
                    <td className="p-2">{customer.address}</td>
                    <td className="p-2">{new Date(customer.created_at).toLocaleDateString('ja-JP')}</td>
                  </tr>
                ))}
                {(!customers || customers.length === 0) && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">データがありません</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">最新の案件 (10件)</h3>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">作業内容</th>
                  <th className="p-2 text-left">開始日</th>
                  <th className="p-2 text-left">金額</th>
                </tr>
              </thead>
              <tbody>
                {jobs?.slice(0, 10).map((job) => (
                  <tr key={job.id} className="border-t">
                    <td className="p-2">{job.description}</td>
                    <td className="p-2">{new Date(job.start_date).toLocaleDateString('ja-JP')}</td>
                    <td className="p-2">{job.amount.toLocaleString()}円</td>
                  </tr>
                ))}
                {(!jobs || jobs.length === 0) && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">データがありません</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
