import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { formatInTimeZone } from 'date-fns-tz';

const generateDailyPassword = (): string => {
  const today = new Date();
  const jstDate = formatInTimeZone(today, 'Asia/Tokyo', 'MMdd');
  return `Jatrack${jstDate}`;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/dashboard')) {
    const authCookie = request.cookies.get('jatrack_auth');
    
    if (authCookie?.value === 'authenticated') {
      return NextResponse.next();
    }
    
    const password = request.nextUrl.searchParams.get('password');
    
    if (password === generateDailyPassword()) {
      const response = NextResponse.redirect(new URL('/dashboard', request.url));
      
      response.cookies.set({
        name: 'jatrack_auth',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24時間
        path: '/',
      });
      
      return response;
    }
    
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
