import { NextRequest, NextResponse } from "next/server";
import { createUser, updateUserCountry } from "@/services";

export async function PUT(request: NextRequest): Promise<NextResponse> {
    try {
        const userId = await createUser();

        const countryCode = request.headers.get('x-vercel-ip-country');
        if (countryCode) {
            await updateUserCountry(userId, countryCode);
        }

        return NextResponse.json({ userId });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}
