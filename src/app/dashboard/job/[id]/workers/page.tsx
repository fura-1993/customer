import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSupabaseServer } from '@/lib/supabaseService';
import WorkersForm from './workers-form';

export const metadata: Metadata = {
  title: '作業員管理 | 顧客管理システム',
  description: '案件の作業員を管理するページです',
};

export const dynamic = 'force-dynamic';

export default async function JobWorkersPage({
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
        name
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">作業員管理</h1>
        <Link href={`/dashboard/job/${id}`} passHref>
          <Button variant="outline">案件詳細へ戻る</Button>
        </Link>
      </div>
      
      <div className="rounded-lg border p-4 bg-muted/50">
        <h2 className="text-lg font-semibold">案件情報</h2>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <span className="text-muted-foreground">顧客名:</span> {job.customers.name}
          </div>
          <div>
            <span className="text-muted-foreground">作業内容:</span> {job.description}
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border p-6">
        <WorkersForm jobId={id} initialWorkers={workers || []} />
      </div>
    </div>
  );
}
