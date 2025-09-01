
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware is no longer strictly necessary with the client-side AuthContext logic,
// but it provides an extra layer of protection on the server-side.
// It prevents the dashboard from even being rendered for an unauthenticated user.
// The client-side logic will still handle the redirect.

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebaseIdToken');
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith('/dashboard');

  if (isProtectedRoute && !token) {
    // If trying to access a protected route without a token,
    // rewrite to the login page. The client-side AuthProvider will handle the actual redirect.
    return NextResponse.rewrite(new URL('/login', request.url));
  }

  return NextResponse.next();
}
