import { NextResponse } from 'next/server'
import { verifyJwtToken } from './libs/auth';
import connectDB from './libs/db/mongodb';
 
export async function middleware(request) {

  //connectDB();
  const token = request.cookies.get('token')?.value;
  const url = request.url;
  const hasVerifiedToken = token && (await verifyJwtToken(token));
  //console.log(token);
  //console.log(request.nextUrl.pathname);
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