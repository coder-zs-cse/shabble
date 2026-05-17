import { DailyPuzzle } from "@prisma/client";
import { prisma } from "@/lib";

const cachedBoardsByKey = new Map<string, DailyPuzzle>();
const cachedBoardsById = new Map<number, DailyPuzzle>();
const cacheExpiryTimers = new Map<string, ReturnType<typeof setTimeout>>();

const normalizeDate = (date: string): string => new Date(date).toISOString().split('T')[0];
const getCacheKey = (date: string, boardSize: number): string => `${date}:${boardSize}`;

const getExpiryMillis = (date: string): number => {
    const normalizedDate = normalizeDate(date);
    const puzzleDate = new Date(`${normalizedDate}T00:00:00.000Z`);
    const nextDay = new Date(puzzleDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    return Math.max(0, nextDay.getTime() - Date.now());
};

const scheduleCacheEviction = (cacheKey: string, puzzleId: number, ttl: number): void => {
    const existingTimer = cacheExpiryTimers.get(cacheKey);
    if (existingTimer) {
        clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
        cacheExpiryTimers.delete(cacheKey);
        cachedBoardsByKey.delete(cacheKey);
        cachedBoardsById.delete(puzzleId);
    }, ttl);

    cacheExpiryTimers.set(cacheKey, timer);
};

export function fetchBoard(boardSize: number): { x: number, y: number }[] {
    const randomCoordinates: { x: number, y: number }[] = [];
    const startX = Math.floor(Math.random() * boardSize);
    const startY = Math.floor(Math.random() * boardSize);

    randomCoordinates.push({ x: startX, y: startY });

    while (randomCoordinates.length < boardSize) {
        const randIndex = Math.floor(Math.random() * randomCoordinates.length);
        const lastCoord = randomCoordinates[randIndex];
        const directions = [
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 }
        ];

        directions.sort(() => Math.random() - 0.5);

        for (const { dx, dy } of directions) {
            const newX = lastCoord.x + dx;
            const newY = lastCoord.y + dy;

            if (
                newX >= 0 && newX < boardSize &&
                newY >= 0 && newY < boardSize &&
                !randomCoordinates.some(coord => coord.x === newX && coord.y === newY)
            ) {
                randomCoordinates.push({ x: newX, y: newY });
                break;
            }
        }
    }

    return randomCoordinates;
}

interface getCurrentBoardParams {
    puzzleId?: number;
    boardSize?: number;
    date?: string;
}

const cacheDailyPuzzle = (dailyPuzzle: DailyPuzzle): void => {
    const normalizedDate = normalizeDate(dailyPuzzle.date.toISOString().split('T')[0]);
    const cacheKey = getCacheKey(normalizedDate, dailyPuzzle.boardSize);

    cachedBoardsByKey.set(cacheKey, dailyPuzzle);
    cachedBoardsById.set(dailyPuzzle.id, dailyPuzzle);
    scheduleCacheEviction(cacheKey, dailyPuzzle.id, getExpiryMillis(normalizedDate));
};

const getCachedCurrentBoard = async (date: string, boardSize: number): Promise<DailyPuzzle> => {
    const normalizedDate = normalizeDate(date);
    const cacheKey = getCacheKey(normalizedDate, boardSize);
    const cached = cachedBoardsByKey.get(cacheKey);
    if (cached) {
        return cached;
    }

    const puzzleDate = new Date(`${normalizedDate}T00:00:00.000Z`);
    let dailyPuzzle = await prisma.dailyPuzzle.findUnique({
        where: {
            date_boardSize: {
                date: puzzleDate,
                boardSize
            }
        }
    });

    if (!dailyPuzzle) {
        const board = fetchBoard(boardSize);
        dailyPuzzle = await prisma.dailyPuzzle.create({
            data: {
                date: puzzleDate,
                board,
                boardSize
            }
        });
    }

    cacheDailyPuzzle(dailyPuzzle);
    return dailyPuzzle;
};

const getCachedCurrentBoardById = async (puzzleId: number): Promise<DailyPuzzle> => {
    const cached = cachedBoardsById.get(puzzleId);
    if (cached) {
        return cached;
    }

    const dailyPuzzle = await prisma.dailyPuzzle.findUnique({
        where: {
            id: puzzleId
        }
    });

    if (!dailyPuzzle) {
        throw new Error("Invalid puzzleId");
    }

    cacheDailyPuzzle(dailyPuzzle);
    return dailyPuzzle;
};

export async function getCurrentBoard({ puzzleId, boardSize, date }: getCurrentBoardParams): Promise<DailyPuzzle> {
    if (puzzleId) {
        return getCachedCurrentBoardById(puzzleId);
    }

    if (!date || !boardSize) {
        throw new Error("Invalid date or boardSize");
    }

    return getCachedCurrentBoard(date, boardSize);
}

export function getAdjacentCount(board: { x: number, y: number }[], boardSize: number, x: number, y: number): number {
    let adjacentCount = 0;
    const directions = [
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: -1, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: 0, y: 0 }
    ];

    directions.forEach(({ x: dx, y: dy }) => {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize) {
            adjacentCount += board.some(({ x, y }) => x === newX && y === newY) ? 1 : 0;
        }
    });
    return adjacentCount;
}

export function checkGuess(board: { x: number, y: number }[], guess: string[][]): boolean {
    return board.every(({ x, y }) => guess[x][y] === 'X');
}
