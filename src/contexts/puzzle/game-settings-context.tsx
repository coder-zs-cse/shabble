'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameSettings } from '@/types';
import { DEFAULT_BOARD_SIZE, MAX_STARS, MAX_HINTS } from '@/constants';

interface GameSettingsContextType {
    settings: GameSettings & { solutionGrid: boolean[][] }; // Extends types with the solution grid matrix
    isLoading: boolean;
    error: Error | null;
    updateSettings: (updates: Partial<GameSettings & { solutionGrid: boolean[][] }>) => void;
    takeHint: (x: number, y: number) => Promise<boolean>;
    makeGuess: () => Promise<{ success: boolean; won: boolean; }>;
    updateGuess: (x: number, y: number, value: string) => void;
    loadingCoordinates: { x: number; y: number } | undefined;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

export function GameSettingsProvider({ children }: { children: React.ReactNode }) {
    // Generates a target pattern that dynamically matches the grid size (e.g., top row target)
    const generateDynamicSolution = (size: number): boolean[][] => {
        return Array.from({ length: size }, (_, r) => 
            Array.from({ length: size }, (_, c) => r === 0)
        );
    };

    const [settings, setSettings] = useState<GameSettings & { solutionGrid: boolean[][] }>({
        puzzleId: 999,
        date: new Date().toISOString().split('T')[0],
        boardSize: DEFAULT_BOARD_SIZE,
        board: Array.from({ length: DEFAULT_BOARD_SIZE }, () => Array(DEFAULT_BOARD_SIZE).fill('')),
        solutionGrid: generateDynamicSolution(DEFAULT_BOARD_SIZE),
        guess: Array.from({ length: DEFAULT_BOARD_SIZE }, () => Array(DEFAULT_BOARD_SIZE).fill('')),
        guessTileCount: 0,
        hints: 0, 
        gameStatus: "playing",
        stars: 0,
        statistics: {
            played: 5,
            totalStars: 12,
            currentStreak: 3,
            bestStreak: 5,
            starDistribution: Array(MAX_STARS + 1).fill(1)
        }
    });
    
    const [loadingCoordinates, setLoadingCoordinates] = useState<{ x: number; y: number } | undefined>(undefined);
    
    const isLoading = false;
    const error = null;

    //  DYNAMIC SYNCHRONIZATION: Whenever the board size changes, resize the solutions grid alongside it
    useEffect(() => {
        const freshBoard = Array.from({ length: settings.boardSize }, () => Array(settings.boardSize).fill(''));
        
        setSettings(prev => ({
            ...prev,
            board: freshBoard,
            solutionGrid: generateDynamicSolution(settings.boardSize),
            guess: Array.from({ length: settings.boardSize }, () => Array(settings.boardSize).fill('')),
            hints: 0, 
            gameStatus: "playing",
            stars: 0
        }));
    }, [settings.boardSize]); 

    const updateSettings = (updates: Partial<GameSettings & { solutionGrid: boolean[][] }>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    };

    const takeHint = async (x: number, y: number): Promise<boolean> => {
        if (settings.gameStatus !== "playing") return false;
        if (settings.board[x][y] !== '') return false;
        
        const maxHintsAllowed = MAX_HINTS[settings.boardSize] || 5;
        if (settings.hints >= maxHintsAllowed) return false; 
        
        try {
            setLoadingCoordinates({ x, y });
            setSettings(prev => ({ ...prev, gameStatus: "tile-loading" }));
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Read absolute truth from our live dynamic solutions grid matrix
            const isTarget = settings.solutionGrid[x]?.[y] || false;
           
            let mockDisplayValue = "";

            if (isTarget) {
                mockDisplayValue = "X";
            } else {
                let neighboringTargetsCount = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const checkX = x + i;
                        const checkY = y + j;
                        
                        const isNeighborATarget = settings.solutionGrid[checkX]?.[checkY] || false;

                        if (isNeighborATarget) {
                            neighboringTargetsCount++;
                        }
                    }
                }
                mockDisplayValue = neighboringTargetsCount.toString();
            }
            
            const newBoard = settings.board.map(row => [...row]);
            newBoard[x][y] = mockDisplayValue;
            
            setLoadingCoordinates(undefined);

            setSettings(prev => ({
                ...prev,
                board: newBoard,
                hints: prev.hints + 1, 
                gameStatus: "playing"
            }));
            
            return true;
        } catch (err) {
            setSettings(prev => ({ ...prev, gameStatus: "playing" }));
            setLoadingCoordinates(undefined);
            return false;
        }
    };

    const makeGuess = async () => {
        if (settings.gameStatus === "playing") {
            updateSettings({ gameStatus: "guessing" });
            return { success: true, won: false };
        }

        if (settings.gameStatus === "guessing") {
            updateSettings({ gameStatus: "guess-loading" });
            await new Promise(resolve => setTimeout(resolve, 800));

            let totalTargetTilesCount = 0;
            let correctlyGuessedCount = 0;
            let incorrectGuessesCount = 0;

            // Evaluated with proper clean iteration updates
            for (let r = 0; r < settings.boardSize; r++) {
                for (let c = 0; c < settings.boardSize; c++) {
                    const isActualTarget = settings.solutionGrid[r]?.[c] || false;
                    const didUserGuess = settings.guess[r]?.[c] === 'X';

                    if (isActualTarget) {
                        totalTargetTilesCount++;
                        if (didUserGuess) correctlyGuessedCount++;
                    } else if (didUserGuess) {
                        incorrectGuessesCount++;
                    }
                }
            }

            const totalMissedTiles = totalTargetTilesCount - correctlyGuessedCount;
            
            // DYNAMIC STAR ALLOCATION (Easy: 5, Medium: 6, Hard: 7)
            let earnedStars = 0;
            
            if (incorrectGuessesCount === 0 && totalMissedTiles === 0) {
                earnedStars = 3; // Perfect match
            } 
            else if (incorrectGuessesCount <= 1 && totalMissedTiles <= 1) {
                earnedStars = 2; // Missed 1 or 1 wrong item max
            } 
            else if (incorrectGuessesCount <= 2 && correctlyGuessedCount >= 3) {
                earnedStars = 1; // 1 Star performance cushion
            }

            if (earnedStars > 0) {
                updateSettings({
                    gameStatus: "won",
                    stars: earnedStars,
                    statistics: {
                        ...settings.statistics,
                        played: settings.statistics.played + 1,
                        currentStreak: settings.statistics.currentStreak + 1,
                        bestStreak: Math.max(settings.statistics.bestStreak, settings.statistics.currentStreak + 1)
                    }
                });
                return { success: true, won: true };
            } else {
                updateSettings({ 
                    gameStatus: "lost",
                    stars: 0,
                    statistics: {
                        ...settings.statistics,
                        played: settings.statistics.played + 1,
                        currentStreak: 0
                    }
                });
                return { success: true, won: false };
            }
        }

        return { success: false, won: false };
    };

    const updateGuess = (x: number, y: number, value: string) => {
        if (settings.gameStatus !== "guessing") return;
        
        setSettings(prev => {
            const newGuess = prev.guess.map(row => [...row]);
            newGuess[x][y] = newGuess[x][y] === 'X' ? '' : 'X';

            let totalGuessedCount = 0;
            for (let r = 0; r < prev.boardSize; r++) {
                for (let c = 0; c < prev.boardSize; c++) {
                    if (newGuess[r][c] === 'X') {
                        totalGuessedCount++;
                    }
                }
            }

            return {
                ...prev,
                guess: newGuess,
                guessTileCount: totalGuessedCount
            };
        });
    };

    return (
        <GameSettingsContext.Provider value={{ settings, isLoading, error, updateSettings, takeHint, makeGuess, updateGuess, loadingCoordinates }}>
            {children}
        </GameSettingsContext.Provider>
    );
}

export function useGameSettings() {
    const context = useContext(GameSettingsContext);
    if (context === undefined) {
        throw new Error('useGameSettings must be used within a GameSettingsProvider');
    }
    return context;
}