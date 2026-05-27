import { NextResponse } from "next/server";
import { createUser } from "@/services";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_development_secret_do_not_use_in_prod"
);

export async function PUT(): Promise<NextResponse> {
    try {
        const userId = await createUser();
        
        const token = await new SignJWT({ userId })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('10y')
            .sign(JWT_SECRET);

        return NextResponse.json({ userId, token });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}