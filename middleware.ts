import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, just allow all requests
  // This needs to be replaced with proper NextAuth middleware when NextAuth v5 is stable
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // Allow auth pages
  if (isAuthPage) {
    return NextResponse.next();
  }

  // For dashboard pages, check for session token
  if (isDashboardPage) {
    const token = request.cookies.get('next-auth.session-token') || 
                  request.cookies.get('__Secure-next-auth.session-token');

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
