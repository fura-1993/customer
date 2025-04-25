import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSupabaseServer } from '@/lib/supabaseService';
import { formatInTimeZone } from 'date-fns-tz';
import { UploadButton } from '@/components/upload-button';

export const metadata: Metadata = {
  title: '案件詳細 | 顧客管理システム',
  description: '案件の詳細情報を表示するページです',
};

export const dynamic = 'force-dynamic';

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = getSupabaseServer();
  
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select(`
      *,
      customers (
        id,
        name,
        address
      )
    `)
    .eq('id', id)
    .single();
  
  if (jobError || !job) {
    notFound();
  }
  
  const { data: workers, error: workersError } = await supabase
    .from('workers')
    .select('*')
    .eq('job_id', id)
    .order('created_at', { ascending: true });
  
  if (workersError) {
    console.error('作業員データの取得エラー:', workersError);
  }
  
  const { data: assets, error: assetsError } = await supabase
    .from('assets')
    .select('*')
    .eq('job_id', id)
    .order('created_at', { ascending: true });
  
  if (assetsError) {
    console.error('アセットデータの取得エラー:', assetsError);
  }
  
  const assetsByType = assets?.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = [];
    }
    acc[asset.type].push(asset);
    return acc;
  }, {} as Record<string, typeof assets>) || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{job.description}</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/job/${id}/edit`} passHref>
            <Button variant="outline">案件情報編集</Button>
          </Link>
          <Link href={`/dashboard/${job.customers.id}`} passHref>
            <Button variant="outline">顧客詳細へ戻る</Button>
          </Link>
        </div>
      </div>
      
      <div className="rounded-lg border p-4 bg-muted/50">
        <h2 className="text-lg font-semibold">顧客情報</h2>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <span className="text-muted-foreground">お客様氏名:</span> {job.customers.name}
          </div>
          <div>
            <span className="text-muted-foreground">お客様住所:</span> {job.customers.address}
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-2">案件情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">現場住所</h3>
            <p>{job.site_address}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">作業内容</h3>
            <p>{job.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">作業開始日</h3>
            <p>{formatInTimeZone(new Date(job.start_date), 'Asia/Tokyo', 'yyyy年MM月dd日')}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">作業終了日</h3>
            <p>{job.end_date ? formatInTimeZone(new Date(job.end_date), 'Asia/Tokyo', 'yyyy年MM月dd日') : '未定'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">請負金額</h3>
            <p>{job.amount.toLocaleString()}円</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">定期希望</h3>
            <p>{job.periodic ? 'あり' : 'なし'}</p>
          </div>
          {job.memo && (
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">その他事項</h3>
              <p className="whitespace-pre-wrap">{job.memo}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">作業員名簿</h2>
            <Link href={`/dashboard/job/${id}/workers`} passHref>
              <Button size="sm">作業員管理</Button>
            </Link>
          </div>
          
          {workers && workers.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">名前</th>
                    <th className="p-2 text-left">登録日</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker.id} className="border-t">
                      <td className="p-2">{worker.name}</td>
                      <td className="p-2">{formatInTimeZone(new Date(worker.created_at), 'Asia/Tokyo', 'yyyy年MM月dd日')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground">作業員が登録されていません</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">ファイル</h2>
            <Link href={`/dashboard/job/${id}/files`} passHref>
              <Button size="sm">ファイル管理</Button>
            </Link>
          </div>
          
          {assets && assets.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(assetsByType).map(([type, typeAssets]) => (
                <div key={type} className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">{getAssetTypeLabel(type)}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {typeAssets.map((asset) => (
                      <div key={asset.id} className="rounded border p-2 text-sm">
                        <p className="truncate">{asset.filename}</p>
                        <a
                          href={`/api/files/${asset.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          表示
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground">ファイルが登録されていません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
