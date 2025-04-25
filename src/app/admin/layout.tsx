import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSupabaseServer, isAdminEmail } from '@/lib/supabaseService';
import { adminLogout } from './layout-actions';

export const metadata: Metadata = {
  title: '管理者ページ | 顧客管理システム',
  description: '顧客管理システムの管理者ページです',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/admin/login');
  }
  
  const email = session.user?.email;
  if (!email || !isAdminEmail(email)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">アクセス権限がありません</h1>
            <p className="text-muted-foreground">
              このページは管理者のみアクセスできます
            </p>
          </div>
          <Button
            className="w-full"
            onClick={async () => {
              await supabase.auth.signOut();
              redirect('/admin/login');
            }}
          >
            ログアウト
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xl font-bold">
              顧客管理システム（管理者）
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" passHref>
              <Button variant="ghost">ダッシュボードへ</Button>
            </Link>
            <form action={adminLogout}>
              <Button variant="outline" type="submit">ログアウト</Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6">
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} 顧客管理システム
        </div>
      </footer>
    </div>
  );
}
