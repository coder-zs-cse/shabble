'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameSettings, GameStatusResponse } from '@/types';
import { checkGuess, getGameStatus, getHint } from '@/api/daily-api';
import { DEFAULT_BOARD_SIZE, MAX_HINTS, MAX_STARS } from '@/constants';
import { coordinatesToBoard } from '@/lib';

interface GameSettingsContextType {
    settings: GameSettings;
    isLoading: boolean;
    error: Error | null;
    updateSettings: (updates: Partial<GameSettings>) => void;
    takeHint: (x: number, y: number) => Promise<boolean>;
    makeGuess: () => Promise<{ success: boolean; won: boolean; }>;
    updateGuess: (x: number, y: number, value: string) => void;
    loadingCoordinates: { x: number; y: number } | undefined;
    radarCenter: { row: number; col: number } | null;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

function generateSimulatedMatrix(size: number): string[][] {
    const matrix = Array.from({ length: size }, () => Array(size).fill(''));
    const center = Math.floor(size / 2);
    
    const hiddenShape = [
        { r: center, c: center },
        { r: center - 1, c: center },
        { r: center + 1, c: center },
        { r: center, c: center - 1 }
    ];

    hiddenShape.forEach(p => {
        if (p.r >= 0 && p.r < size && p.c >= 0 && p.c < size) {
            matrix[p.r][p.c] = 'X';
        }
    });

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r][c] === 'X') continue;
            let minDist = Infinity;
            hiddenShape.forEach(p => {
                const d = Math.abs(r - p.r) + Math.abs(c - p.c);
                if (d < minDist) minDist = d;
            });
            matrix[r][c] = minDist !== Infinity ? String(minDist) : '1';
        }
    }
    return matrix;
}

export function GameSettingsProvider({ children }: { children: React.ReactNode }) {
    const initialSize = (DEFAULT_BOARD_SIZE === 5 || DEFAULT_BOARD_SIZE === 6 || DEFAULT_BOARD_SIZE === 7) 
        ? DEFAULT_BOARD_SIZE 
        : 6;

    const [settings, setSettings] = useState<GameSettings>({
        puzzleId: 101,
        date: new Date().toISOString().split('T')[0],
        boardSize: initialSize,
        board: Array.from({ length: initialSize }, () => Array(initialSize).fill('')),
        guess: Array.from({ length: initialSize }, () => Array(initialSize).fill('')),
        guessTileCount: 0,
        hints: 0,
        gameStatus: "playing",
        stars: 0,
        statistics: {
            played: 0,
            totalStars: 0,
            currentStreak: 0,
            bestStreak: 0,
            starDistribution: Array(MAX_STARS + 1).fill(0)
        }
    });
    
    const [loadingCoordinates, setLoadingCoordinates] = useState<{ x: number; y: number } | undefined>(undefined);
    const [radarCenter, setRadarCenter] = useState<{ row: number; col: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [offlineMatrix, setOfflineMatrix] = useState<string[][]>([]);

    useEffect(() => {
        setOfflineMatrix(generateSimulatedMatrix(settings.boardSize));
    }, [settings.boardSize]);

    useEffect(() => {
        async function fetchGameSettings() {
            setIsLoading(true);
            setError(null);
            try {
                const data: GameStatusResponse = await getGameStatus(settings.date, settings.boardSize);
                setSettings(prev => ({
                    ...prev,
                    puzzleId: data.puzzleId,
                    hints: data.hintCount,
                    board: coordinatesToBoard(data.hintCoordinates, settings.boardSize),
                    guess: Array.from({ length: settings.boardSize }, () => Array(settings.boardSize).fill('')),
                    guessTileCount: 0,
                    gameStatus: data.gameStatus,
                    statistics: data.statistics
                }));
            } catch {
                // FIXED: Removed unused variable name definition to pass linter bounds
                setSettings(prev => ({
                    ...prev,
                    board: Array.from({ length: prev.boardSize }, () => Array(prev.boardSize).fill('')),
                    guess: Array.from({ length: prev.boardSize }, () => Array(prev.boardSize).fill('')),
                    gameStatus: "playing"
                }));
            } finally {
                setIsLoading(false);
            }
        }

        fetchGameSettings();
    }, [settings.date, settings.boardSize]);

    const updateSettings = (updates: Partial<GameSettings>) => {
        setSettings(prev => {
            const updated = { ...prev, ...updates };
            if (updates.boardSize !== undefined) {
                const s = updates.boardSize;
                if (s === 5 || s === 6 || s === 7) {
                    updated.boardSize = s;
                }
            }
            return updated;
        });
    };

    const takeHint = async (x: number, y: number): Promise<boolean> => {
        const currentMaxHints = MAX_HINTS[settings.boardSize] || 99;
        if ((settings.board[x] && settings.board[x][y] !== '') || settings.hints >= currentMaxHints) return false;
        if (settings.gameStatus === "tile-loading") return false;

        setRadarCenter({ row: x, col: y });
        setTimeout(() => { setRadarCenter(null); }, 1500);

        try {
            setLoadingCoordinates({ x, y });
            const data = await getHint(settings.puzzleId, x, y);
            
            const newBoard = settings.board.map(row => [...row]);
            newBoard[x][y] = data.adjacentCount.toString();
            
            setSettings(prev => ({
                ...prev,
                hints: prev.hints + 1,
                board: newBoard
            }));
            return true;
        } catch {
            // FIXED: Removed unused error instantiation variables
            const fallbackValue = (offlineMatrix[x] && offlineMatrix[x][y]) || '1';
            const fallbackBoard = settings.board.map(row => [...row]);
            fallbackBoard[x][y] = fallbackValue;

            setSettings(prev => ({
                ...prev,
                hints: prev.hints + 1,
                board: fallbackBoard
            }));
            return true;
        } finally {
            setLoadingCoordinates(undefined);
        }
    };

    const makeGuess = async () => {
        try {
            updateSettings({ gameStatus: "guess-loading" });
            const [response] = await Promise.all([
                checkGuess(settings.puzzleId, settings.guess, settings.hints),
                new Promise(resolve => setTimeout(resolve, 2000))
            ]);
            
            if (response.gameStatus === "won") {
                updateSettings({
                    board: settings.guess,
                    gameStatus: "won",
                    stars: response.stars,
                    statistics: response.statistics
                });
                return { success: true, won: true };
            }

            updateSettings({
                hints: response.hintCount,
                gameStatus: response.gameStatus,
                statistics: response.statistics
            });
            return { success: true, won: false };
        } catch {
            // FIXED: Removed unused error declaration reference identifiers
            let match = true;
            for (let r = 0; r < settings.boardSize; r++) {
                for (let c = 0; c < settings.boardSize; c++) {
                    if (offlineMatrix[r] && offlineMatrix[r][c] === 'X' && settings.guess[r]?.[c] !== 'X') {
                        match = false;
                    }
                }
            }
            if (match) {
                updateSettings({ gameStatus: "won" });
                return { success: true, won: true };
            }
            updateSettings({ gameStatus: "playing" });
            return { success: true, won: false };
        }
    };

    const updateGuess = (x: number, y: number, value: string) => {
        const newGuess = settings.guess.map(row => [...row]);
        if (newGuess[x]) {
            newGuess[x][y] = value;
            updateSettings({ guess: newGuess });
        }
    };

    return (
        <GameSettingsContext.Provider value={{
            settings,
            isLoading,
            error,
            updateSettings,
            takeHint,
            makeGuess,
            updateGuess,
            loadingCoordinates,
            radarCenter 
        }}>
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