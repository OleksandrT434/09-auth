import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkSessionServer } from '@/lib/api/serverApi';

const PUBLIC_ROUTES  = ['/sign-in', '/sign-up'];
const PRIVATE_ROUTES = ['/profile', '/notes'];

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const store = await cookies();
  const accessToken  = store.get('accessToken')?.value;
  const refreshToken = store.get('refreshToken')?.value;

  const isPublic  = PUBLIC_ROUTES.some(r => pathname.startsWith(r));
  const isPrivate = PRIVATE_ROUTES.some(r => pathname.startsWith(r));

  if (accessToken && isPublic) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!accessToken && refreshToken) {
    try {
      const resp = await checkSessionServer(); 
      const setCookie = resp.headers['set-cookie'];

      if (setCookie) {
        const res = isPublic ? NextResponse.redirect(new URL('/', req.url)) : NextResponse.next();
        const list = Array.isArray(setCookie) ? setCookie : [setCookie];
        const opts = { httpOnly: true as const, secure: true as const, sameSite: 'lax' as const, path: '/' as const };

        for (const raw of list) {
          const p = parse(raw);
          if (p.accessToken)  res.cookies.set('accessToken',  p.accessToken,  opts);
          if (p.refreshToken) res.cookies.set('refreshToken', p.refreshToken, opts);
        }
        return res;
      }
      if (isPublic) return NextResponse.redirect(new URL('/', req.url));
      return NextResponse.next();
    } catch {

      const fail = NextResponse.redirect(new URL('/sign-in', req.url));
      fail.cookies.delete('accessToken');
      fail.cookies.delete('refreshToken');
      return fail;
    }
  }
  if (!accessToken && isPrivate) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}
