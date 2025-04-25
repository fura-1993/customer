import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSupabaseServer } from '@/lib/supabaseService';
import JobForm from '../../../[id]/new-job/job-form';

export const metadata: Metadata = {
  title: '案件情報編集 | 顧客管理システム',
  description: '案件情報を編集するページです',
};

export const dynamic = 'force-dynamic';

export default async function EditJobPage({
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">案件情報編集</h1>
        <Link href={`/dashboard/job/${id}`} passHref>
          <Button variant="outline">戻る</Button>
        </Link>
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
      
      <div className="rounded-lg border p-6">
        <JobForm 
          customerId={job.customers.id} 
          job={{
            ...job,
            customer_id: job.customer_id,
            start_date: new Date(job.start_date),
            end_date: job.end_date ? new Date(job.end_date) : null,
          }} 
        />
      </div>
    </div>
  );
}
