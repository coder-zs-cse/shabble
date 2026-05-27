import { validateStatusParams } from "@/lib";
import { getGameStatus, validateUser } from "@/services";
import { GameStatusResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const userId = request.headers.get('userId');

        const { isValid, errors, data } = validateStatusParams(searchParams, userId);
        if (!isValid || !data) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const userExists = await validateUser(data.userId!);
        if (!userExists) {
            return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
        }

        const { boardSize, date } = data;

        const status = await getGameStatus(date, boardSize, userId!);

        return NextResponse.json<GameStatusResponse>(status);
    } catch (error) {
        console.error("Error fetching status:", error);
        return NextResponse.json({ error: "Error fetching status" }, { status: 500 });
    }
}