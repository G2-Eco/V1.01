import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl;

  // Define public routes (accessible without authentication)
  const publicRoutes = ['/login', '/register', '/verify-email', '/resend-verification', '/forgot-password'];

  // Define protected routes (require authentication)
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/orders', '/products', '/wishlist', '/checkout', '/productmanager'];

  // Admin only routes
  const adminRoutes = ['/dashboard', '/productmanager'];

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Check if current path is an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Get token from cookie
  const token = request.cookies.get('accessToken')?.value;

  // Decode JWT to extract role (server side)
  const getRoleFromToken = (jwt: string | undefined): string | null => {
    if (!jwt) return null;
    try {
      const payload = jwt.split('.')[1];
      // Convert base64url to base64
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
      const decoded = atob(padded);
      const parsed = JSON.parse(decoded);
      return parsed.role || null;
    } catch (e) {
      return null;
    }
  };
  const role = getRoleFromToken(token);
  const isAdmin = role === 'ADMIN';

  // If user is authenticated and trying to access public routes (login/register)
  // Redirect to dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and trying to access protected routes
  // Redirect to login with redirect parameter
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated but not admin and trying to access admin routes
  if (token && isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};