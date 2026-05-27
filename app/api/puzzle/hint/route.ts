import { getAdjacentCount, getCurrentBoard, updateUserProgress } from "@/services";
import { NextResponse } from "next/server";
import { validateHintParams } from "@/lib";
import { ApiResponse, getHintResponse } from "@/types/api/daily-api";
import { ERROR_CODES, ERROR_MESSAGES } from "@/constants";

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const userId = request.headers.get('userId');

        const { isValid, errors, data } = validateHintParams(searchParams, userId);
        if (!isValid || !data) {
            return NextResponse.json<ApiResponse<null>>(
                { data: null, error: { code: ERROR_CODES.VALIDATION_ERROR, message: errors?.join("; ") ?? ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR] } },
                { status: 400 }
            );
        }

        const { puzzleId, x, y } = data;

        const currentBoard = await getCurrentBoard({ puzzleId });
        console.log("Current board in hint", currentBoard);
        const board = currentBoard.board as { x: number, y: number }[];

        const adjacentCount = getAdjacentCount(board, currentBoard.boardSize, x, y);
        const updatedUserProgress = await updateUserProgress({ userId: data.userId!, puzzleId: currentBoard.id, boardSize: currentBoard.boardSize, hint: { x, y, c: adjacentCount }, status: 'playing' });

        return NextResponse.json<ApiResponse<getHintResponse>>({ data: { adjacentCount, hintCount: updatedUserProgress.hintCount } });
    } catch (error) {
        console.error("Error fetching hint:", error);
        return NextResponse.json<ApiResponse<null>>(
            { data: null, error: { code: ERROR_CODES.INTERNAL_SERVER_ERROR, message: ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR] } },
            { status: 500 }
        );
    }
}
