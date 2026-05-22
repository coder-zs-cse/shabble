import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    const userId = body?.userId;

    if (!userId || typeof userId !== "string") {
        return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set("anon_user_id", userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 300,
        path: "/",
    });

    return NextResponse.json({ ok: true });
}
