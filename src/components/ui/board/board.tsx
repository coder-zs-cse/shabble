'use client'
import React from 'react';
import Tile from '../tile/tile'; 
import { useGameSettings } from '@/contexts/puzzle/game-settings-context';

interface BoardProps {
    board: string[][];
    guess: string[][];
    onTileClick?: (x: number, y: number) => Promise<void>; // FIXED: Changed from unknown to void to match TileProps
    gameStatus?: string;
    incorrectGuess?: boolean;
    className?: string;
    tileClassName?: string;
}

export default function Board({ board, guess, onTileClick, gameStatus, incorrectGuess, className, tileClassName }: BoardProps) {
    const { radarCenter } = useGameSettings();
    const boardSize = board && board.length ? board.length : 6;

    const isWithinRadarRange = (row: number, col: number) => {
        if (!radarCenter) return false;
        return Math.abs(row - radarCenter.row) <= 1 && Math.abs(col - radarCenter.col) <= 1;
    };

    return (
        <div 
            className={`w-full grid gap-1.5 md:gap-2 aspect-square ${className || ''}`}
            style={{
                gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`
            }}
        >
            {Array.from({ length: boardSize }, (_, row) => (
                Array.from({ length: boardSize }, (_, col) => {
                    const cellKey = `${row}-${col}`;
                    const currentTileContent = board && board[row] ? board[row][col] : '';
                    const currentGuessContent = guess && guess[row] ? guess[row][col] : '';

                    return (
                        <Tile 
                            key={cellKey}
                            tileContent={currentTileContent} 
                            guessContent={currentGuessContent}
                            onClick={async () => {
                                if (onTileClick) {
                                    await onTileClick(row, col);
                                }
                            }}
                            gameStatus={gameStatus}
                            incorrectGuess={incorrectGuess}
                            className={tileClassName}
                            isRadarHighlighted={isWithinRadarRange(row, col)}
                            isRevealedHint={currentTileContent !== ''}
                        />
                    );
                })
            ))}
        </div>
    );
}