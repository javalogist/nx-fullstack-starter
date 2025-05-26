import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from '@kodevy-core-2.0/frontend/shared';

export async function middleware(request: NextRequest) {
  const token = await getToken();
  const path = request.nextUrl.pathname;

  if (
    path.startsWith('/_next/') ||
    path.endsWith('.ico') ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.css') ||
    path.endsWith('.js') ||
    path === '/login' ||
    path === '/verify'
  ) {
    return NextResponse.next(); // Allow static files & login page without token check
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
