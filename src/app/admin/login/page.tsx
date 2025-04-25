import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabaseService';
import AdminLoginForm from './admin-login-form';

export const metadata: Metadata = {
  title: '管理者ログイン | 顧客管理システム',
  description: '顧客管理システムの管理者ログインページです',
};

export default async function AdminLoginPage() {
  const supabase = getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">管理者ログイン</h1>
          <p className="text-muted-foreground">メールアドレスとパスワードでログイン</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
