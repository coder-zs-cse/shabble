import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    try {
        // Skip middleware for non-API routes and new-user route
        if (!request.nextUrl.pathname.startsWith('/api') || 
            request.nextUrl.pathname === '/api/new-user') {
            return NextResponse.next()
        }

        const userId = request.headers.get('userId')
        const authRoute = request.nextUrl.pathname.startsWith('/api/auth');
        const leaderboardRoute = request.nextUrl.pathname === '/api/leaderboard';

        if (!userId && !authRoute && !leaderboardRoute) {
            const newUserResponse = await fetch(`${request.nextUrl.origin}/api/new-user`, {
                method: 'PUT',
            })
            const data = await newUserResponse.json()
            
            const newRequest = new Request(request.url, {
                method: request.method,
                headers: new Headers(request.headers),
                body: request.body
            })
            newRequest.headers.set('userId', data.userId)
            
            const response = NextResponse.rewrite(new URL(request.url), {
                request: newRequest
            })
            response.headers.set('X-User-Id', data.userId)
            return response
        }

        return NextResponse.next()
    } catch (error) {
        console.error('Error in middleware:', error)
        return NextResponse.next()
    }
}

export const config = {
    matcher: '/api/:path*'
}