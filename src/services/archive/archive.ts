import { axiosSecure } from "@/api/axios";
import { prisma } from "@/lib/db/connect";

export async function getArchiveData(userId: string){
    const puzzles= await prisma.dailyPuzzle.findMany({
        orderBy: {
            id: "asc",
        },
    });
    console.log(puzzles.length);

    const progress= await prisma.userProgress.findMany({
        where: {
            userId,
        },
    });

    const progressMap = new Map(
        progress.map((p)=>[p.puzzleId,p])
    );

    return puzzles.map((puzzle)=>({
        id: puzzle.id,
        date: puzzle.date,
        stars: progressMap.get(puzzle.id)?.stars ?? 0,
        attempted: !!progressMap.get(puzzle.id),
    }))
}

export const getArchiveGameStatus= async (puzzleId: number)=>{
    const response= await axiosSecure.get(`/archive/status?puzzleId=${puzzleId}`);

    return response.data;
}