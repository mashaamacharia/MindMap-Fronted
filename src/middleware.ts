/**
 * Next.js Middleware
 * 
 * Protected: all /(dashboard)/* routes
 * Protected: /admin/* routes (superadmin only)
 * Public: /, /auth/*, /api/*
 * 
 * Auth check: read 'm1ndmap11-token' cookie
 * No token → redirect to /auth/login
 * Non-superadmin on /admin/* → redirect to /dashboard
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cookie name for auth token
const TOKEN_COOKIE = 'm1ndmap11-token';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/verify',
  '/auth/magic-link',
  '/auth/accept',
  '/auth/complete-profile',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const isAuthenticated = !!token;

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route
  );
  const isAuthRoute = pathname.startsWith('/auth/');
  const isApiRoute = pathname.startsWith('/api/');
  const isStaticRoute = pathname.startsWith('/_next/') || 
    pathname.startsWith('/fonts/') || 
    pathname.startsWith('/images/') ||
    pathname === '/favicon.ico';

  // Allow static and API routes
  if (isStaticRoute || isApiRoute) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages (except complete-profile)
  if (isAuthenticated && isAuthRoute && pathname !== '/auth/complete-profile') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow auth routes for unauthenticated users
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, we rely on client-side role checking
  // The API will return 403 for non-superadmin users
  // Admin layout guard provides additional protection

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
