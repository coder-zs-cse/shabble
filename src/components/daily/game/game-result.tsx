import React from "react"
import { RiStarSFill } from "react-icons/ri"
import { GameState } from '@/types'

interface GameResultProps {
    gameStatus: GameState
    stars: number
    isShowingSolution?: boolean
    onToggleSolution?: () => void | Promise<void> 
}

export function GameResult({ gameStatus, stars, isShowingSolution, onToggleSolution }: GameResultProps) {
    return (
        <>
            <div className='flex items-center justify-center space-x-2 h-[30px] md:h-[50px]'>
                {stars ? (
                    Array.from({ length: stars }, (_, index) => (
                        <RiStarSFill 
                            className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] text-[#ffac33]' 
                            key={index} 
                        />
                    ))
                ) : (
                    <span className='text-[#a9abad] font-normal text-sm sm:text-xl md:text-2xl'>
                        NO STARS THIS TIME
                    </span>
                )}
            </div>
            
            <div className='flex flex-col items-center justify-center w-full min-h-[90px] bg-gray-100 p-4 rounded-xl mt-4 space-y-4'>
                {gameStatus === "won" ? (
                    <WinMessage />
                ) : (
                    <LoseMessage 
                        isShowingSolution={isShowingSolution || false} 
                        onToggleSolution={onToggleSolution} 
                    />
                )}
            </div>
        </>
    )
}

function WinMessage() {
    return (
        <div className='flex flex-col items-center justify-center'>
            <span className='text-green-700 font-bold text-sm sm:text-xl md:text-2xl'>
                CONGRATS! YOU WON!
            </span>
            <span className='text-black font-base text-sm sm:text-md md:text-xl'>
                Come back tomorrow to guess the new shape!
            </span>
        </div>
    )
}

interface LoseMessageProps {
    isShowingSolution: boolean
    onToggleSolution?: () => void | Promise<void>
}

function LoseMessage({ isShowingSolution, onToggleSolution }: LoseMessageProps) {
    return (
        <div className='flex flex-col items-center justify-center w-full space-y-4'>
            <div className='flex flex-col items-center justify-center text-center'>
                <span className='text-red-700 font-bold text-sm sm:text-xl md:text-2xl animate-pulse'>
                    GAME OVER!
                </span>
                <span className='text-black font-medium text-sm sm:text-md md:text-lg mt-1'>
                    Better luck next time!
                </span>
            </div>

            <button 
                onClick={onToggleSolution}
                className='px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold text-sm rounded-lg shadow-md transition-all duration-150'
            >
                {isShowingSolution ? "Hide Correct Solution" : "Show Correct Solution"}
            </button>
        </div>
    )
}