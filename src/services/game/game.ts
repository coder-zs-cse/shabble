import { prisma } from "@/lib";
import { getCurrentBoard } from "./puzzle";
import { MAX_HINTS, MAX_STARS } from "@/constants";
import { GameStatusResponse } from "@/types";
import { UserProgress } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { getStatistics, incrementPlayedCount, updateStars, updateStreak } from "@/services";

export const getUserProgress = async (userId: string, puzzleId: number): Promise<UserProgress> => {
    try {
        // console.log("parameters in get user progress", userId, puzzleId)
        let userProgress;
        userProgress = await prisma.userProgress.findUnique({
            where: { userId_puzzleId: { userId, puzzleId } }
        });
        if (!userProgress) {
            [userProgress,] = await Promise.all([
                prisma.userProgress.create({
                    data: { userId, puzzleId }
                }),
                incrementPlayedCount(userId)
            ]);
            return userProgress;
        }
        return userProgress;
    } catch (error) {
        console.error("Error fetching user progress:", error);
        throw error;
    }
}


interface UpdateUserProgressParams {
    userId: string;
    puzzleId: number;
    boardSize: number;
    hint?: { x: number, y: number, c: number };
    hintCount?: number;
    status?: string;
}

export const updateUserProgress = async ({ userId, puzzleId, boardSize, hint, status }: UpdateUserProgressParams): Promise<UserProgress> => {
    try {
        // console.log("updateUserProgress", { userId, puzzleId, boardSize, hint, status });
        const userProgress = await getUserProgress(userId, puzzleId);
        // console.log("userProgress in updateUserProgress", userProgress);

        if (hint) {
            const hintCoordinates = userProgress.hintCoordinates as { x: number, y: number }[];
            userProgress.hintCoordinates = [...hintCoordinates, hint];
            userProgress.hintCount += 1;
        }
        if (status === 'CORRECT') {
            userProgress.status = 'won';
            userProgress.stars = Math.min(MAX_STARS, Math.max(1, MAX_HINTS[boardSize as keyof typeof MAX_HINTS] - userProgress.hintCount));
            await Promise.all([
                updateStreak(userId, true),
                updateStars(userId, userProgress.stars)
            ]);
        }
        else if (status === 'WRONG') {
            const updatedHintCount = userProgress.hintCount + 2;
            if (updatedHintCount > MAX_HINTS[boardSize as keyof typeof MAX_HINTS]) {
                userProgress.status = 'lost';
                await Promise.all([
                    updateStreak(userId, false),
                    updateStars(userId, 0)
                ]);
            }
            userProgress.hintCount = Math.min(updatedHintCount, MAX_HINTS[boardSize as keyof typeof MAX_HINTS]);

        }
        // console.log("userProgress in updateUserProgress after", userProgress);

        const updatedUserProgress = await prisma.userProgress.update({
            where: { userId_puzzleId: { userId, puzzleId } },
            data: {
                ...userProgress,
                hintCoordinates: userProgress.hintCoordinates as InputJsonValue
            }
        });
        return updatedUserProgress;
    } catch (error) {
        console.error("Error updating user progress:", error);
        throw error;
    }

}


export const getGameStatus = async (date: string, boardSize: number, userId: string): Promise<GameStatusResponse> => {
    try {
        const currentBoard = await getCurrentBoard({ date, boardSize });
        // console.log("currentBoard in getGameStatus", currentBoard);
        const userProgress = await prisma.userProgress.findUnique({
            where: { userId_puzzleId: { userId, puzzleId: currentBoard.id } }
        });
        const statistics = await getStatistics(userId);
        if (!userProgress) {
            const status: GameStatusResponse = {
                hintCoordinates: [],
                hintCount: 0,
                puzzleId: currentBoard.id,
                gameStatus: "playing",
                statistics
            }
            return status;
        }

        const status: GameStatusResponse = {
            hintCoordinates: userProgress.hintCoordinates as { x: number, y: number, c: number }[],
            hintCount: userProgress.hintCount,
            puzzleId: currentBoard.id,
            gameStatus: userProgress.status as "playing" | "won" | "lost",
            statistics
        }
        if (userProgress.status === 'won') {
            status.solutionCoordinates = currentBoard.board as { x: number, y: number }[];
            status.stars = userProgress.stars || 0;
        }
        return status;
    } catch (error) {
        console.error("Error fetching game status:", error);
        throw error;
    }

}