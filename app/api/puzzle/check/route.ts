import { validateGuessCheckParams } from "@/lib";
import { checkGuess, getCurrentBoard, getStatistics, updateUserProgress } from "@/services";
import { ApiResponse, checkGuessResponse } from "@/types";
import { ERROR_CODES, ERROR_MESSAGES } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const userId = request.headers.get('userId');

        const { isValid, errors, data } = validateGuessCheckParams(await request.json(), userId);
        if (!isValid || !data) {
            return NextResponse.json<ApiResponse<null>>(
                { data: null, error: { code: ERROR_CODES.VALIDATION_ERROR, message: errors?.join("; ") ?? ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR] } },
                { status: 400 }
            );
        }

        const { puzzleId, guess } = data;

        const currentBoard = await getCurrentBoard({ puzzleId });
        const isCorrect = checkGuess(currentBoard.board as { x: number, y: number }[], guess);
        const updatedUserProgress = await updateUserProgress({ userId: data.userId!, boardSize: currentBoard.boardSize, puzzleId: currentBoard.id, status: isCorrect ? 'CORRECT' : 'WRONG' });
        const statistics = await getStatistics(userId!);

        return NextResponse.json<ApiResponse<checkGuessResponse>>(
            { data: { isCorrect, hintCount: updatedUserProgress.hintCount, gameStatus: updatedUserProgress.status, stars: updatedUserProgress.stars || undefined, statistics } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking guess:", error);
        return NextResponse.json<ApiResponse<null>>(
            { data: null, error: { code: ERROR_CODES.INTERNAL_SERVER_ERROR, message: ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR] } },
            { status: 500 }
        );
    }
}
