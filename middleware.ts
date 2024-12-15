// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/getSession';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();
  const user = session?.user;

  console.log('Session:', session);
  console.log("User:", user);
  console.log("Pathname:", pathname);


  // Redirect authenticated users away from the login page
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!session && !user && pathname !== '/login' && pathname !== '/' && pathname !== '/register') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to match all routes except static files and API routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
