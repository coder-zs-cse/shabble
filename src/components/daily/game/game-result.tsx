import { useState } from "react"
import { RiStarSFill } from "react-icons/ri"
import { GameState } from '@/types'

interface GameResultProps {
    gameStatus: GameState
    stars: number
    solution?: string[][] // Accepting the solution grid array as an optional prop
}

export function GameResult({ gameStatus, stars, solution }: GameResultProps) {
    const [showSolution, setShowSolution] = useState(false);

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
                        solution={solution} 
                        showSolution={showSolution} 
                        setShowSolution={setShowSolution} 
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
    solution?: string[][]
    showSolution: boolean
    setShowSolution: (val: boolean) => void
}

function LoseMessage({ solution, showSolution, setShowSolution }: LoseMessageProps) {
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

            {/* Feature Implementation: Show/Hide Toggle Button */}
            <button 
                onClick={() => setShowSolution(!showSolution)}
                className='px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold text-sm rounded-lg shadow-md transition-all duration-150'
            >
                {showSolution ? "Hide Correct Solution" : "Show Correct Solution"}
            </button>

            {/* Feature Implementation: Solution Grid Visualizer */}
            {showSolution && solution && solution.length > 0 && (
                <div className='flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-inner border border-gray-200 w-full max-w-[280px] sm:max-w-[340px] animate-fadeIn'>
                    <span className='text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider block'>
                        Hidden Target Layout
                    </span>
                    <div 
                        className='grid gap-1.5 p-1 bg-gray-50 rounded-lg border border-gray-100' 
                        style={{ gridTemplateColumns: `repeat(${solution.length}, minmax(0, 1fr))` }}
                    >
                        {solution.flatMap((row, rowIndex) => 
                            row.map((cell, colIndex) => {
                                // Evaluates true if the grid cell contains active shape metadata
                                const isShapePart = cell && cell !== "" && cell !== " ";
                                return (
                                    <div 
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md font-bold text-xs shadow-sm transition-colors duration-300
                                            ${isShapePart ? 'bg-green-500 text-white border border-green-600' : 'bg-gray-200 text-transparent border border-gray-300'}`}
                                    >
                                        {cell}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}