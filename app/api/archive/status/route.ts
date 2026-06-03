import { prisma } from "@/lib/db/connect";
import { getGameStatus } from "@/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try{
        const userId= request.headers.get("userId");

        if(!userId){
            return NextResponse.json(
                {error: "Missing userId"},
                {status: 400}
            )
        }

        const puzzleId= Number(request.nextUrl.searchParams.get("puzzleId"));

        if(!puzzleId){
            return NextResponse.json(
                {error:"Missing puzzleId"},
                {status: 400}
            )
        }

        const puzzle= await prisma.dailyPuzzle.findUnique({
            where: {
                id: puzzleId,
            },
        });

        if(!puzzle){
            return NextResponse.json(
                {error:"Puzzle not found"},
                {status: 404}
            )
        }

        const status= await getGameStatus(
            puzzle.date.toISOString().split("T")[0],
            puzzle.boardSize,
            userId
        );

        return NextResponse.json(status);
    }catch(error){
        console.log(error);

        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        )
    }
}