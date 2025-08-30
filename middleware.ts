import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];
const SITE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "";
const API_BASE = `${SITE}/api`;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookies = request.headers.get("cookie") || "";

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  const hasAccess = /(^|;\s*)accessToken=/.test(cookies);
  const hasRefresh = /(^|;\s*)refreshToken=/.test(cookies);

  if (!hasAccess && hasRefresh) {
    const res = await fetch(`${API_BASE}/auth/session`, {
      method: "GET",
      headers: { cookie: cookies },
      credentials: "include",
    });

    let nextResponse: NextResponse;
    if (isPublicRoute) {
      nextResponse = NextResponse.redirect(new URL("/", request.url));
    } else {
      nextResponse = NextResponse.next();
    }

    for (const [key, value] of res.headers) {
      if (key.toLowerCase() === "set-cookie") {
        nextResponse.headers.append("set-cookie", value);
      }
    }

    return nextResponse;
  }


  if (!hasAccess && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (hasAccess && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up"],
};
