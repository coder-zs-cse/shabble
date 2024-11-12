'use client'
import React from 'react'
import { Loader } from '@/components'
import { useGameSettings } from '@/contexts'
import { 
    GameHeader,
    GameStatus,
    GameControls,
    GameResult,
} from './game'
import { useGameLogic } from '@/hooks'

function Daily() {
    const { settings, isLoading } = useGameSettings();
    const {
        showHelp,
        showStatistics,
        incorrectGuess,
        handleTileClick,
        handleSubmitButton,
        setShowHelp,
        setShowStatistics
    } = useGameLogic();

    // if (isLoading) {
    //     return (
    //         <div className='flex items-center justify-center w-full h-full'>
    //             <Loader />
    //         </div>
    //     );
    // }

    console.log("settings in daily", settings)
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
                        board={settings.board}
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