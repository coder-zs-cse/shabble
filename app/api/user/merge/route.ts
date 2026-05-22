import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { mergeAnonymousUser } from "@/services";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await auth();
    const dbUserId = (session?.user as { dbUserId?: string })?.dbUserId;

    if (!dbUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const anonymousUserId = body?.anonymousUserId;

    if (!anonymousUserId || typeof anonymousUserId !== "string") {
        return NextResponse.json({ error: "Invalid anonymousUserId" }, { status: 400 });
    }

    await mergeAnonymousUser(anonymousUserId, dbUserId);
    return NextResponse.json({ ok: true });
}
