import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'ログイン | 顧客管理システム',
  description: '顧客管理システムのログインページです',
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('jatrack_auth');
  if (authCookie?.value === 'authenticated') {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">顧客管理システム</h1>
          <p className="text-muted-foreground">日替わりパスワードでログイン</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
