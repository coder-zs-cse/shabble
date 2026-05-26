import { NextResponse } from "next/server";
import { getLeaderboard } from "@/services";

export async function GET() {
    try {
        const users = await getLeaderboard();
        return NextResponse.json({ users });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
