import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl;

  // Define public routes (accessible without authentication)
  const publicRoutes = ['/login', '/register', '/verify-email', '/product', '/resend-verification', '/forgot-password'];

  // Routes that should redirect authenticated users
  const authOnlyRoutes = ['/login', '/register'];

  // Define protected routes (require authentication)
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/orders', '/wishlist', '/checkout'];

  // Admin only routes
  const adminRoutes = ['/dashboard'];

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Check if current path is an auth-only route (login/register)
  const isAuthOnlyRoute = authOnlyRoutes.some(route => pathname.startsWith(route));

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Check if current path is an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Get token from cookie
  const token = request.cookies.get('accessToken')?.value;

  // Get user data from cookie (we'll need to set this from the client)
  const userCookie = request.cookies.get('user')?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;
  const isAdmin = user?.role === 'ADMIN';

  // If user is authenticated and trying to access auth-only routes (login/register)
  // Redirect to home
  if (token && isAuthOnlyRoute) {
    return NextResponse.redirect(new URL('/', request.url));
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