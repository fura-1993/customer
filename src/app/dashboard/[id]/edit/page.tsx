import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSupabaseServer } from '@/lib/supabaseService';
import CustomerForm from '../../new-customer/customer-form';

export const metadata: Metadata = {
  title: '顧客情報編集 | 顧客管理システム',
  description: '顧客情報を編集するページです',
};

export const dynamic = 'force-dynamic';

export default async function EditCustomerPage({
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
        <h1 className="text-3xl font-bold">顧客情報編集</h1>
        <Link href={`/dashboard/${id}`} passHref>
          <Button variant="outline">戻る</Button>
        </Link>
      </div>
      
      <div className="rounded-lg border p-6">
        <CustomerForm customer={customer} />
      </div>
    </div>
  );
}
