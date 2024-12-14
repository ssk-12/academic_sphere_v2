// middleware.ts (or app/middleware.ts)

import { NextResponse } from 'next/server';
import { getSession } from './lib/getSession';

export async function middleware(request: Request) {
  const { pathname } = new URL(request.url);
  const session = await getSession(); // Retrieve session for user info
  const user = session?.user;

  // Redirect authenticated users away from the login page
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!session && pathname !== '/login' && pathname !== '/' && pathname !== '/register') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Handle protected routes for classes and events
  const match = pathname.match(/^\/classes\/class\/([^/]+)(?:\/event\/([^/]+))?/);
  if (match) {
    const [, classId, eventId] = match;

    // Ensure the user is authenticated
    if (!user?.id) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Make a request to the API route to check access
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/check-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId, eventId, userId: user.id }),
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      console.error('Access Denied:', error.message);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to match specific routes
export const config = {
  matcher: [
    '/classes/class/:path*', // Apply to class and event routes
    '/login',
    '/', 
    '/register', // Include auth and public routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Exclude static and API routes
  ],
};
