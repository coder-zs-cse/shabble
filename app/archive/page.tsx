"use client"

import React, { useEffect } from 'react'
import { useState } from 'react';
import { GameHeader } from '@/components/daily/game'
import { GameSettingsProvider } from '@/contexts';
import PuzzleCard from '@/components/archive/PuzzleCard';
import { getUserId } from '@/api/user';
import Link from 'next/link';

interface ArchivePuzzle{
    id: number,
    date: string,
    stars: number,
    attempted: boolean
}

const page = () => {
    const [showHelp, setShowHelp] = useState(false);
    const [showStatistics, setShowStatistics] = useState(false);
    const [puzzles, setPuzzles]= useState<ArchivePuzzle[]>([]);
    
    useEffect(()=>{
        const loadArchive= async ()=> {
            const userId= await getUserId();

            const res=await fetch("/api/archive",{
                headers: {
                    userId,
                },
            });

            const data=await res.json();
            setPuzzles(data);
        }

        loadArchive();
    },[])
    return (
        <div className='relative flex flex-col items-center w-full h-full overflow-hidden'>
            <GameSettingsProvider>
                <GameHeader
                    showHelp={showHelp}
                    setShowHelp={setShowHelp}
                    showStatistics={showStatistics}
                    setShowStatistics={setShowStatistics}
                    statistics={{
                        played: 0,
                        totalStars: 0,
                        currentStreak: 0,
                        bestStreak: 0,
                        starDistribution: [],
                    }}
                />
            </GameSettingsProvider>

            <h1 className='text-md font-bold text-gray-400'>ARCHIVES</h1>
            <p className='p-5 flex justify-center items-center text-center text-gray-400'>Welcome to the Shabble Archives. Here you can find all the past puzzles, these do not count towards your regular statistics. Solve and enjoy!</p>

            <div className='flex flex-col gap-5 px-3 w-full'>
                {puzzles.map((puzzle) => (
                    <Link key={puzzle.id} href={`/archive/${puzzle.id}`} className='cursor-pointer'>
                    <PuzzleCard
                        key={puzzle.id}
                        id={puzzle.id}
                        date={puzzle.date}
                        stars={puzzle.stars}
                        attempted={puzzle.attempted}
                    />
                    </Link>
                ))}
            </div>
        </div>

    )
}

export default page
