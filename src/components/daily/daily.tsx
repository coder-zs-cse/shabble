'use client'
import React, { useState } from 'react'
import { Loader } from '@/components'
import { useGameSettings } from '@/contexts'
import {
    GameHeader,
    GameStatus,
    GameControls,
    GameResult,
} from './game'
import { useGameLogic } from '@/hooks'
import { toast } from 'react-toastify'
import { getSolution } from '@/api/daily-api'

function Daily() {
    const { settings, isLoading, error } = useGameSettings();
    const {
        showHelp,
        showStatistics,
        incorrectGuess,
        handleTileClick,
        handleSubmitButton,
        setShowHelp,
        setShowStatistics
    } = useGameLogic();

    // NEW STATE: To hold the fetched solution
    const [fetchedSolution, setFetchedSolution] = useState<string[][] | null>(null);
    const [isShowingSolution, setIsShowingSolution] = useState(false);

   const toggleSolution = async () => {
        if (!isShowingSolution && !fetchedSolution) {
            try {
                // Makes the API call just like the owner asked
                const sol = await getSolution(settings.puzzleId);
                setFetchedSolution(sol);
                setIsShowingSolution(true);
            } catch (err) {
                // If the backend isn't ready, we just log it and do nothing else.
                console.error("Failed to fetch solution:", err);
            }
        } else if (fetchedSolution) {
            // Toggles the UI back and forth only if we actually have the data
            setIsShowingSolution(!isShowingSolution);
        }
    }

    // Determine what to show on the main board
    const displayBoard = (isShowingSolution && fetchedSolution) 
        ? fetchedSolution 
        : settings.board;

    if(error){
        toast.error("Database is inactive, please ask developer to activate it");
    }
    
    return (
        <div className='relative flex flex-col items-center w-full h-full overflow-hidden'>
            <GameHeader
                showHelp={showHelp}
                showStatistics={showStatistics}
                setShowHelp={setShowHelp}
                setShowStatistics={setShowStatistics}
                statistics={settings.statistics}
            />
            {isLoading ?
                <div className='flex items-center justify-center w-full h-full'>
                    <Loader />
                </div>
                : (
                    <div className='flex flex-col items-center w-full h-full overflow-auto hide-scrollbar'>
                        <div className='flex-1 w-full h-full' />
                        <div className='flex flex-col items-center w-full space-y-4 z-10'>
                            <GameStatus
                                date={settings.date}
                                // Pass the displayBoard instead of settings.board
                                board={displayBoard} 
                                guess={settings.guess}
                                gameStatus={settings.gameStatus}
                                incorrectGuess={incorrectGuess}
                                onTileClick={handleTileClick}
                            />

                            <GameControls
                                gameStatus={settings.gameStatus}
                                guessTileCount={settings.guessTileCount}
                                boardSize={settings.boardSize}
                                onSubmit={handleSubmitButton}
                            />

                            {(settings.gameStatus === "won" || settings.gameStatus === "lost") && (
                                <GameResult
                                    gameStatus={settings.gameStatus}
                                    stars={settings.stars}
                                    // Pass the toggle function and state down
                                    isShowingSolution={isShowingSolution}
                                    onToggleSolution={toggleSolution}
                                />  
                            )}
                        </div>  
                        <div className='flex-1 w-full h-full' />
                    </div>
                )}
        </div>
    )
}

export default Daily