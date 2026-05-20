'use client'
import React from 'react'
import Tile from '../tile/tile'
import { useGameSettings } from '@/contexts/puzzle/game-settings-context'

export default function Board() {
    const { settings, loadingCoordinates, takeHint, updateGuess } = useGameSettings();
    const { board, guess, gameStatus, boardSize, solutionGrid } = settings;

    const handleSmartClick = async (row: number, col: number) => {
        if (gameStatus === "won" || gameStatus === "lost" || gameStatus === "tile-loading" || gameStatus === "guess-loading") return;

        if (gameStatus === "playing") {
            await takeHint(row, col);
        } else if (gameStatus === "guessing") {
            updateGuess(row, col, 'X');
        }
    };

    const gridStyle = {
        gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
    };

    return (
        <div className="w-full max-w-md mx-auto px-4">
            <div 
                style={gridStyle}
                className="grid gap-2 w-full aspect-square bg-transparent rounded-lg"
            >
                {board.map((rowArr, rowIndex) => 
                    rowArr.map((tileContent, colIndex) => {
                        const guessContent = guess[rowIndex]?.[colIndex] || '';
                        
                        // Absolute truth evaluation directly from your contextual solutions grid
                        const isSolutionTarget = solutionGrid[rowIndex]?.[colIndex] || false;
                        
                        // DYNAMIC NEIGHBOR CHECK:
                        // Calculates if this cell is directly adjacent to the exact tile currently running a hint load pulse!
                        let isCurrentNeighbor = false;
                        if (loadingCoordinates) {
                            const rowDiff = Math.abs(rowIndex - loadingCoordinates.x);
                            const colDiff = Math.abs(colIndex - loadingCoordinates.y);
                            // It's a neighbor if it falls within a 1-tile distance box (excluding the clicked tile itself)
                            isCurrentNeighbor = rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
                        }

                        // Checks if this specific tile is the one currently running the loading spinner text
                        const isThisTileLoading = loadingCoordinates?.x === rowIndex && loadingCoordinates?.y === colIndex;
                        
                        return (
                            <Tile
                                key={`${rowIndex}-${colIndex}`}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                                tileContent={tileContent}
                                guessContent={guessContent}
                                gameStatus={gameStatus}
                                isSolutionTarget={isSolutionTarget}
                                isLoading={isThisTileLoading} // Passed down explicitly per tile location
                                isNeighbor={isCurrentNeighbor} // Corrected reactive link target
                                onClick={() => handleSmartClick(rowIndex, colIndex)}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}