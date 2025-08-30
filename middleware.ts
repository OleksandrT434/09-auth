import { NextRequest, NextResponse } from 'next/server';
import { checkSessionServer } from '@/lib/api/serverApi';
import { parse } from 'cookie';

const PUBLIC  = ['/sign-in', '/sign-up'];
const PRIVATE = ['/profile', '/notes'];

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic  = PUBLIC.some(p => pathname.startsWith(p));
  const isPrivate = PRIVATE.some(p => pathname.startsWith(p));

  try {
    const resp = await checkSessionServer(); 
    const authenticated = Boolean(resp.data?.authenticated);

    if (authenticated) {
      if (isPublic) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      const ok = NextResponse.next();
      const setCookie = resp.headers['set-cookie'];
      if (setCookie) {
        const list = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const raw of list) {
          const parsed = parse(raw);
          if (parsed.accessToken)  ok.cookies.set('accessToken',  parsed.accessToken,  { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
          if (parsed.refreshToken) ok.cookies.set('refreshToken', parsed.refreshToken, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
        }
      }
      return ok;
    }
    if (isPrivate) {
      const fail = NextResponse.redirect(new URL('/sign-in', req.url));
      fail.cookies.delete('accessToken');
      fail.cookies.delete('refreshToken');
      return fail;
    }
    return NextResponse.next();

  } catch {
    if (isPrivate) {
      const fail = NextResponse.redirect(new URL('/sign-in', req.url));
      fail.cookies.delete('accessToken');
      fail.cookies.delete('refreshToken');
      return fail;
    }
    return NextResponse.next();
  }
}
