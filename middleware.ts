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
        const response = NextResponse.next()
        
        // If no userId in header or user doesn't exist, create new user
        if (!userId) {
            const newUserResponse = await fetch(`${request.nextUrl.origin}/api/new-user`, {
                method: 'PUT',
            })
            const data = await newUserResponse.json()
            
            // Create a new request with the updated headers
            const newRequest = new Request(request.url, {
                method: request.method,
                headers: new Headers(request.headers),
                body: request.body
            })
            newRequest.headers.set('userId', data.userId)
            
            // Create response from the new request
            const response = NextResponse.rewrite(new URL(request.url), {
                request: newRequest
            })
            response.headers.set('X-User-Id', data.userId)
            return response
        }

        return response
    } catch (error) {
        console.error('Error in middleware:', error)
        return NextResponse.next()
    }
}

export const config = {
    matcher: '/api/:path*'
}