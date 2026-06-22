import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/register", "/"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-storage")?.value; // zustand persist stores in localStorage, not cookie. For simplicity, we use client-side check. We'll handle protection via hooks/redirects in layout. Middleware can read token from cookie if we store there. We'll rely on client-side route protection.
  // Actually, we can't access localStorage in middleware. We'll implement protected routes inside app components using a hook. So middleware just passes.
  return NextResponse.next();
}