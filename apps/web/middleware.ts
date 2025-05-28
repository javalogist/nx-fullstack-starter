import { TokenManager } from '@kodevy-core-2.0/frontend/shared';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await TokenManager.get();
  const path = request.nextUrl.pathname;

  if (
    path.startsWith('/_next/') ||
    path.endsWith('.ico') ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.css') ||
    path.endsWith('.js') ||
    path === '/login' ||
    path === '/verify-email' ||
    path === '/success'
  ) {
    return NextResponse.next(); // Allow static files & login page without token check
  }

  if(token && path === 'login'){
    return NextResponse.redirect('/');
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
