import { DailyPuzzle } from "@prisma/client";

// Hardcoded sample coordinate data so it never needs a database
const MOCK_BOARD = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 0, y: 3 },
  { x: 0, y: 4 }
];

export function fetchBoard(boardSize: number): { x: number, y: number }[] {
    return MOCK_BOARD;
}

interface getCurrentBoardParams {
    puzzleId?: number;
    boardSize?: number;
    date?: string;
}

export async function getCurrentBoard({ puzzleId, boardSize, date }: getCurrentBoardParams): Promise<DailyPuzzle> {
    // We return a fake DailyPuzzle object directly to the front-end. 
    // No database lookups, no Prisma errors, no timezone issues.
    return {
        id: "mock-puzzle-id",
        date: new Date(),
        shape: JSON.stringify(MOCK_BOARD),
        boardSize: boardSize || 5,
        createdAt: new Date()
    } as DailyPuzzle;
}

export function getAdjacentCount(board: { x: number, y: number }[], boardSize: number, x: number, y: number): number {
    let adjacentCount = 0;
    const directions = [
        { x: -1, y: 0 }, { x: -1, y: -1 }, { x: -1, y: 1 },
        { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 1, y: 1 },
        { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 0, y: 0 }
    ];

    directions.forEach(({ x: dx, y: dy }) => {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize) {
            adjacentCount += board.some(({ x: idX, y: idY }) => idX === newX && idY === newY) ? 1 : 0;
        }
    });
    return adjacentCount;
}

export function checkGuess(board: { x: number, y: number }[], guess: string[][]): boolean {
    return board.every(({ x, y }) => guess[x][y] === 'X');
}