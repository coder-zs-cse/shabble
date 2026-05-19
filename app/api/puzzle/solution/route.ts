import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const puzzleId = searchParams.get("puzzleId");

        if (!puzzleId) {
            return NextResponse.json({ error: "Puzzle ID is required" }, { status: 400 });
        }

        // Query the DailyPuzzle table for BOTH the board data and the board size
        const puzzle = await prisma.dailyPuzzle.findUnique({
            where: {
                id: parseInt(puzzleId), 
            },
            select: {
                board: true,
                boardSize: true
            }
        });

        if (!puzzle) {
            return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
        }

        const coordinates = puzzle.board as { x: number, y: number }[];
        const boardSize = puzzle.boardSize;

        // 1. Create a blank 2D array of the correct size, filled with empty strings
        const solutionGrid = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));

        // 2. Loop through the database coordinates and mark the correct tiles with a "1"
        if (Array.isArray(coordinates)) {
            coordinates.forEach(coord => {
                // y is the row, x is the column
                if (coord.y < boardSize && coord.x < boardSize) {
                    solutionGrid[coord.y][coord.x] = "1"; 
                }
            });
        }

        // 3. Send the beautifully formatted 2D array to the frontend!
        return NextResponse.json(solutionGrid, { status: 200 });

    } catch (error) {
        console.error("Error fetching solution from database:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}