import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { logout } from './actions';

export const metadata: Metadata = {
  title: '顧客管理システム',
  description: '顧客と案件を管理するシステムです',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('jatrack_auth');
  
  if (!authCookie || authCookie.value !== 'authenticated') {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-xl font-bold">
              顧客管理システム
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" passHref>
              <Button variant="ghost">顧客一覧</Button>
            </Link>
            <form action={logout}>
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
