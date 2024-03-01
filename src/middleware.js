import { NextResponse } from 'next/server'
import { verifyJwtToken } from './libs/auth';
 
export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const url = request.url;
  const hasVerifiedToken = token && (await verifyJwtToken(token));
  if (!hasVerifiedToken) {
    if(url.includes("auth/login")||url.includes("auth/signup")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/test",
    "/test/:path*"
  ]
}