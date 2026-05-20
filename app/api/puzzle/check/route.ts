import { validateGuessCheckParams } from "@/lib";
import { checkGuess, getCurrentBoard, getStatistics, updateUserProgress } from "@/services";
import { checkGuessResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const userId = request.headers.get('userId');

        const { isValid, errors, data } = validateGuessCheckParams(await request.json(), userId);
        if (!isValid || !data) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const { puzzleId, guess } = data;

        const currentBoard = await getCurrentBoard({ puzzleId });
    const isCorrect = checkGuess((currentBoard as any).board as { x: number; y: number }[], guess);

    const updatedUserProgress = await updateUserProgress({ 
      userId: data.userId!, 
      boardSize: (currentBoard as any).boardSize, 
      puzzleId: parseInt(currentBoard.id, 10), 
      status: isCorrect ? 'CORRECT' : 'WRONG' 
    });

    const statistics = await getStatistics(userId!);

    return NextResponse.json({ 
      isCorrect, 
      hintCount: (updatedUserProgress as any).hintCount ?? 0, 
      gameStatus: (updatedUserProgress as any).status ?? 'PLAYING', 
      stars: (updatedUserProgress as any).stars ?? undefined, 
      statistics 
    }, { status: 200 });
} catch (error) {
        console.error("Error checking guess:", error);
        return NextResponse.json({ error: "Error checking guess" }, { status: 500 });
    }
}