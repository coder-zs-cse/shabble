import { NextResponse } from "next/server";
import { getLeaderboard } from "@/services";

export async function GET(): Promise<NextResponse> {
    try {
        const entries = await getLeaderboard();
        return NextResponse.json({ entries });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leaderboard' },
            { status: 500 }
        );
    }
}
