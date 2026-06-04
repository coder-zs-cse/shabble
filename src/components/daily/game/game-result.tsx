import { RiStarSFill } from "react-icons/ri"
import { GameState } from '@/types'

interface GameResultProps {
    gameStatus: GameState
    stars: number
}

export function GameResult({ gameStatus, stars }: GameResultProps) {
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
            
            <div className='flex items-center justify-center w-full h-[90px] glass'>
                {gameStatus === "won" ? (
                    <WinMessage />
                ) : (
                    <LoseMessage />
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

function LoseMessage() {
    return (
        <div className='flex flex-col items-center justify-center bg-white dark:bg-gray-800 text-black dark:text-white w-full p-4'>
            <span className='text-red-700 font-bold text-sm sm:text-xl md:text-2xl'>
                GAME OVER!
            </span>
            <span className='text-black dark:text-white font-base text-sm sm:text-md md:text-xl'>
                Come back tomorrow to guess the new shape!
            </span>
        </div>
    )
}