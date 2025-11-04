import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // TEMPORARY: Disabled for development without NextAuth
  // Allow all requests for now
  return NextResponse.next();

  /* TODO: Re-enable when proper auth is implemented
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  if (isAuthPage) {
    return NextResponse.next();
  }

  if (isDashboardPage) {
    const token = request.cookies.get('auth-token');

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
