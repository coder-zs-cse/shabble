import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_development_secret_do_not_use_in_prod"
);

// In-memory rate limiter for Edge Runtime
// Note: This is per-isolate. In production on Vercel, it limits per instance,
// which is sufficient for basic anti-spam protection without external Redis.
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    
    // Cleanup old entries occasionally (simple approach)
    if (Math.random() < 0.1) {
        for (const [key, value] of rateLimitMap.entries()) {
            if (value.resetTime < now) {
                rateLimitMap.delete(key);
            }
        }
    }

    const currentRecord = rateLimitMap.get(ip);
    
    if (!currentRecord || currentRecord.resetTime < now) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return true; // Allowed
    }

    if (currentRecord.count >= MAX_REQUESTS_PER_WINDOW) {
        return false; // Rate limited
    }

    currentRecord.count += 1;
    return true; // Allowed
}

export async function middleware(request: NextRequest) {
    try {
        // Rate Limiting Check
        const ip = request.headers.get('x-forwarded-for') ?? 'unknown-ip';
        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        }

        // Skip auth for non-API routes and new-user route
        if (!request.nextUrl.pathname.startsWith('/api') || 
            request.nextUrl.pathname === '/api/new-user') {
            return NextResponse.next()
        }

        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            
            // Create a new request and inject the verified userId
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('userId', payload.userId as string);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        } catch (jwtError) {
            console.error('Invalid token:', jwtError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

    } catch (error) {
        console.error('Error in middleware:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export const config = {
    matcher: '/api/:path*'
}