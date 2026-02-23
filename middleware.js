import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()

  // AGGRESSIVE CACHE BUSTING - Force browsers to never cache
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  response.headers.set('Surrogate-Control', 'no-store')
  response.headers.set('X-Dashboard-Version', 'v5.1-' + Date.now())

  return response
}

export const config = {
  matcher: '/:path*',
}
