// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // your server config

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthRoute = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
  ].some((p) => pathname.startsWith(p));

  // Important: use req.headers in middleware
  const  data  = await auth.api.getSession({ headers: req.headers });
  const hasSession = Boolean(data?.session);

  // If logged in and on an auth page -> go home
  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If not logged in and on a protected page -> go to sign-in
  if (!hasSession && !isAuthRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // include auth pages so we can bounce logged-in users away from them
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
