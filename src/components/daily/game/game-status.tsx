import { Text, Board } from '@/components'
import { getPuzzleNumber } from '@/lib'
import { GameStatusMessage } from './game-status-message'
import { GameState } from '@/types'

interface GameStatusProps {
    date: string
    board: string[][]
    guess: string[][]
    gameStatus: GameState
    incorrectGuess: boolean
    onTileClick: (x: number, y: number) => Promise<void>
    loadingCoordinates?: { x: number; y: number }
}

export function GameStatus({ 
    date, 
    board, 
    guess, 
    gameStatus, 
    incorrectGuess, 
    onTileClick ,
    loadingCoordinates
}: GameStatusProps) {
    return (
        <>
            <Text className='!text-base md:!text-2xl text-gray-400'>
                DAILY SHABBLE #{getPuzzleNumber(date)}
            </Text>
            <Board
                board={board}
                guess={guess}
                onTileClick={onTileClick}
                gameStatus={gameStatus}
                incorrectGuess={incorrectGuess}
                className='!w-[80%] md:!w-[70%] mt-20'
                loadingCoordinates={loadingCoordinates} // <--- ADDED THIS LINE
            />
            <GameStatusMessage />
        </>
    )
}