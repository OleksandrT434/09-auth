import { NextRequest, NextResponse } from 'next/server';
import { cookies as headerCookies } from 'next/headers';
import { checkSessionServer } from '@/lib/api/serverApi';

const PUBLIC_ROUTES = ['/sign-in', '/sign-up'];
const PRIVATE_ROUTES = ['/profile', '/notes'];

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const store = await headerCookies();
  const accessToken = store.get('accessToken')?.value;
  const refreshToken = store.get('refreshToken')?.value;

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));

  if (accessToken && isPublic) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (!accessToken && refreshToken) {
    const refreshed = await checkSessionServer(refreshToken);

    if (refreshed?.accessToken) {
      const res = isPublic
        ? NextResponse.redirect(new URL('/', req.url))
        : NextResponse.next();
      res.cookies.set('accessToken', refreshed.accessToken, { httpOnly: true, secure: true });
      if (refreshed.refreshToken) {
        res.cookies.set('refreshToken', refreshed.refreshToken, { httpOnly: true, secure: true });
      }
      return res;
    }
    const fail = NextResponse.redirect(new URL('/sign-in', req.url));
    fail.cookies.delete('accessToken');
    fail.cookies.delete('refreshToken');
    return fail;
  }
  if (!accessToken && isPrivate) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  return NextResponse.next();
}
