import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/signup');
  const isEducatorPage = request.nextUrl.pathname.startsWith('/educator');

  // Redirect to login if no tokens and not on auth page
  if (!accessToken && !refreshToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to home if on auth page with valid tokens
  if ((accessToken || refreshToken) && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // For educator pages, let the EducatorGuard handle the role check
  if (isEducatorPage) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/subscriptions/:path*',
    '/educator/:path*',
    '/login',
    '/signup'
  ]
};



