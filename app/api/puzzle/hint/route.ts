import { getAdjacentCount, getCurrentBoard, updateUserProgress, validateUser } from "@/services";
import { NextResponse } from "next/server";
import { validateHintParams } from "@/lib";
import { getHintResponse } from "@/types/api/daily-api";

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const userId = request.headers.get('userId');

        const { isValid, errors, data } = validateHintParams(searchParams, userId);
        if (!isValid || !data) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const userExists = await validateUser(data.userId!);
        if (!userExists) {
            return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
        }

        const { puzzleId, x, y } = data;

        const currentBoard = await getCurrentBoard({ puzzleId });
        console.log("Current board in hint",currentBoard)
        const board = currentBoard.board as { x: number, y: number }[];

        const adjacentCount = getAdjacentCount(board, currentBoard.boardSize, x, y);
        const updatedUserProgress = await updateUserProgress({ userId: data.userId!, puzzleId: currentBoard.id, boardSize: currentBoard.boardSize, hint: { x, y, c: adjacentCount }, status: 'playing' });

        return NextResponse.json<getHintResponse>({ adjacentCount, hintCount: updatedUserProgress.hintCount });
    } catch (error) {
        console.error("Error fetching hint:", error);
        return NextResponse.json({ error: "Error fetching hint" }, { status: 500 });
    }

}