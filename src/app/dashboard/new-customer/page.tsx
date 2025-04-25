import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CustomerForm from './customer-form';

export const metadata: Metadata = {
  title: '新規顧客登録 | 顧客管理システム',
  description: '新規顧客を登録するページです',
};

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">新規顧客登録</h1>
        <Link href="/dashboard" passHref>
          <Button variant="outline">戻る</Button>
        </Link>
      </div>
      
      <div className="rounded-lg border p-6">
        <CustomerForm />
      </div>
    </div>
  );
}
