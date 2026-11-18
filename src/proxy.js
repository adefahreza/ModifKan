import { NextResponse } from 'next/server';

export function proxy(request) {
  if (request.cookies.has('modifkan_session')) return NextResponse.next();
  const { pathname, search } = request.nextUrl;
  const url = new URL('/login', request.url);
  url.searchParams.set('next', pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/cart', '/checkout', '/account/:path*', '/seller/:path*', '/admin/:path*'],
};
