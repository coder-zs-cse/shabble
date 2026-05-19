import { DailyPuzzle } from "@prisma/client";
import { prisma } from "@/lib";
import NodeCache from "node-cache";

const boardCache = new NodeCache();

const normalizeDate = (date: string): string => new Date(date).toISOString().split('T')[0];
const getCacheKey = (date: string, boardSize: number): string => `${date}:${boardSize}`;

const getExpirySeconds = (date: string): number => {
    const normalizedDate = normalizeDate(date);
    const nextDay = new Date(`${normalizedDate}T00:00:00.000Z`);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    return Math.max(0, Math.floor((nextDay.getTime() - Date.now()) / 1000));
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
    boardSize?: number;
    date?: string;
}

export async function getCurrentBoard({ boardSize, date }: getCurrentBoardParams): Promise<DailyPuzzle> {
    if (!date || !boardSize) {
        throw new Error("Invalid date or boardSize");
    }

    const normalizedDate = normalizeDate(date);
    const cacheKey = getCacheKey(normalizedDate, boardSize);
    const cached = boardCache.get<DailyPuzzle>(cacheKey);
    if (cached) {
        return cached;
    }

    const puzzleDate = new Date(`${normalizedDate}T00:00:00.000Z`);
    let dailyPuzzle = await prisma.dailyPuzzle.findUnique({
        where: { date_boardSize: { date: puzzleDate, boardSize } }
    });

    if (!dailyPuzzle) {
        const board = fetchBoard(boardSize);
        dailyPuzzle = await prisma.dailyPuzzle.create({
            data: { date: puzzleDate, board, boardSize }
        });
    }

    boardCache.set(cacheKey, dailyPuzzle, getExpirySeconds(normalizedDate));
    return dailyPuzzle;
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
