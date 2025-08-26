import { NextRequest, NextResponse } from 'next/server';

const privateRouter = ['/profile', '/notes'];
const publicRouter  = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const isPublic  = publicRouter.some(r => pathname.startsWith(r));
  const isPrivate = privateRouter.some(r => pathname.startsWith(r));
  if (accessToken && isPublic) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (!accessToken && isPrivate) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up']
};
