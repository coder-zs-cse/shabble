import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

export async function middleware(request: NextRequest) {
    try {
        // Auth routes and new-user route bypass game-API middleware
        if (request.nextUrl.pathname.startsWith('/api/auth') ||
            request.nextUrl.pathname === '/api/new-user') {
            return NextResponse.next()
        }

        if (!request.nextUrl.pathname.startsWith('/api')) {
            return NextResponse.next()
        }

        // Prefer authenticated session userId over anonymous header
        const session = await auth()
        if (session?.user?.id) {
            const newRequest = new Request(request.url, {
                method: request.method,
                headers: new Headers(request.headers),
                body: request.body
            })
            newRequest.headers.set('userId', session.user.id)
            return NextResponse.rewrite(new URL(request.url), { request: newRequest })
        }

        const userId = request.headers.get('userId')
        if (!userId) {
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
