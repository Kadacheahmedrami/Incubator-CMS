// /middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  // Example: Allow all requests
  return NextResponse.next();
}

// Optional: Define a config to limit middleware scope
export const config = {
  matcher: ['/api/:path*'], // Run middleware only for API routes, for example
};
