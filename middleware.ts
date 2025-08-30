import { NextRequest, NextResponse } from "next/server";

const PRIVATE = ["/profile", "/notes"];
const PUBLIC  = ["/sign-in", "/sign-up"]; 

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie") || "";

  const isPrivate = PRIVATE.some((r) => pathname.startsWith(r));
  const isPublic  = PUBLIC.some((r) => pathname.startsWith(r));

  const hasAccess  = /(^|;\s*)accessToken=/.test(cookieHeader);
  const hasRefresh = /(^|;\s*)refreshToken=/.test(cookieHeader);

  if (!hasAccess && hasRefresh) {
    const res = await fetch(`${origin.replace(/\/+$/, "")}/api/auth/session`, {
      method: "GET",
      headers: { cookie: cookieHeader },
      credentials: "include",
      cache: "no-store",
    });

    if (res.ok) {
      const next = NextResponse.next();
      for (const [k, v] of res.headers) {
        if (k.toLowerCase() === "set-cookie") next.headers.append("set-cookie", v);
      }
      next.headers.set("Cache-Control", "no-store");
      return next;
    }

    if (isPrivate) {
      return NextResponse.redirect(new URL("/sign-in", request.url), { status: 302 });
    }
    return NextResponse.next();
  }

  if (!hasAccess && isPrivate) {
    return NextResponse.redirect(new URL("/sign-in", request.url), { status: 302 });
  }
  if (hasAccess && isPublic) {
    return NextResponse.redirect(new URL("/", request.url), { status: 302 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
