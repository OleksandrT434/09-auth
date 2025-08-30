import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const cookies = request.headers.get("cookie") || "";
  const API_BASE = `${origin.replace(/\/+$/, "")}/api`;

  const isPublic  = publicRoutes.some((r) => pathname.startsWith(r));
  const isPrivate = privateRoutes.some((r) => pathname.startsWith(r));

  const hasAccess  = /(^|;\s*)accessToken=/.test(cookies);
  const hasRefresh = /(^|;\s*)refreshToken=/.test(cookies);

  if (!hasAccess && hasRefresh) {
    const res = await fetch(`${API_BASE}/auth/session`, {
      method: "GET",
      headers: { cookie: cookies },
      credentials: "include",
    });

    if (!res.ok) {
      if (isPrivate) return NextResponse.redirect(new URL("/sign-in", request.url));
      return NextResponse.next();
    }

    const nextRes = NextResponse.next();
    for (const [k, v] of res.headers) {
      if (k.toLowerCase() === "set-cookie") nextRes.headers.append("set-cookie", v);
    }
    nextRes.headers.set("Cache-Control", "no-store");
    return nextRes;
  }

  if (!hasAccess && isPrivate) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (hasAccess && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"], 
};
