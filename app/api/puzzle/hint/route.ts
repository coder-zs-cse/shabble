import { getAdjacentCount, getCurrentBoard, updateUserProgress } from "@/services";
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
        const { puzzleId, x, y } = data;

        let currentBoard;
        try {
            currentBoard = await getCurrentBoard({ puzzleId });
        } catch (error) {
            return NextResponse.json({ error: "Puzzle not found with the provided puzzleId" }, { status: 404 });
        }

        if (x >= currentBoard.boardSize || y >= currentBoard.boardSize) {
            return NextResponse.json({
                error: `Coordinates are out of bounds. For a ${currentBoard.boardSize}x${currentBoard.boardSize} board, coordinates must be between 0 and ${currentBoard.boardSize - 1}.`
            }, { status: 400 });
        }

        const board = currentBoard.board as { x: number, y: number }[];

        const adjacentCount = getAdjacentCount(board, currentBoard.boardSize, x, y);
        const updatedUserProgress = await updateUserProgress({ 
            userId: data.userId!, 
            puzzleId: currentBoard.id, 
            boardSize: currentBoard.boardSize, 
            hint: { x, y, c: adjacentCount }, 
            status: 'playing' 
        });

        return NextResponse.json<getHintResponse>({ adjacentCount, hintCount: updatedUserProgress.hintCount });
    } catch (error) {
        console.error("Error fetching hint:", error);
        return NextResponse.json({ error: "Error fetching hint" }, { status: 500 });
    }
}