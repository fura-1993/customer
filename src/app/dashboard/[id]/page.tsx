import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSupabaseServer } from '@/lib/supabaseService';
import { formatInTimeZone } from 'date-fns-tz';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = getSupabaseServer();
  
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (customerError || !customer) {
    notFound();
  }
  
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*')
    .eq('customer_id', id)
    .order('start_date', { ascending: false });
  
  if (jobsError) {
    console.error('案件データの取得エラー:', jobsError);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{customer.name}</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/${id}/edit`} passHref>
            <Button variant="outline">顧客情報編集</Button>
          </Link>
          <Link href={`/dashboard/${id}/new-job`} passHref>
            <Button>新規案件登録</Button>
          </Link>
        </div>
      </div>
      
      <div className="rounded-lg border p-4">
        <h2 className="text-xl font-semibold mb-2">顧客情報</h2>
        <div className="grid gap-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">お客様氏名</span>
            <span className="col-span-2">{customer.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">お客様住所</span>
            <span className="col-span-2">{customer.address}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">登録日</span>
            <span className="col-span-2">
              {formatInTimeZone(new Date(customer.created_at), 'Asia/Tokyo', 'yyyy年MM月dd日')}
            </span>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mt-6">案件一覧</h2>
      
      {jobs && jobs.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/job/${job.id}`}
              className="block"
            >
              <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <h3 className="text-lg font-semibold">{job.description}</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">現場住所:</span> {job.site_address}
                  </div>
                  <div>
                    <span className="text-muted-foreground">開始日:</span> {formatInTimeZone(new Date(job.start_date), 'Asia/Tokyo', 'yyyy年MM月dd日')}
                  </div>
                  <div>
                    <span className="text-muted-foreground">金額:</span> {job.amount.toLocaleString()}円
                  </div>
                  <div>
                    <span className="text-muted-foreground">定期:</span> {job.periodic ? 'あり' : 'なし'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <h3 className="text-xl font-semibold">案件データがありません</h3>
          <p className="text-muted-foreground mt-2">
            新規案件登録ボタンから案件を追加してください
          </p>
        </div>
      )}
    </div>
  );
}
