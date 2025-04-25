import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSupabaseServer } from '@/lib/supabaseService';
import JobForm from './job-form';

export const metadata: Metadata = {
  title: '新規案件登録 | 顧客管理システム',
  description: '新規案件を登録するページです',
};

export const dynamic = 'force-dynamic';

export default async function NewJobPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = getSupabaseServer();
  
  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">新規案件登録</h1>
        <Link href={`/dashboard/${id}`} passHref>
          <Button variant="outline">戻る</Button>
        </Link>
      </div>
      
      <div className="rounded-lg border p-4 bg-muted/50">
        <h2 className="text-lg font-semibold">顧客情報</h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <span className="text-muted-foreground">お客様氏名:</span> {customer.name}
          </div>
          <div>
            <span className="text-muted-foreground">お客様住所:</span> {customer.address}
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border p-6">
        <JobForm customerId={id} />
      </div>
    </div>
  );
}
