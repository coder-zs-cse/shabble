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
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

export function GameSettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<GameSettings>({
        puzzleId: 0,
        date: new Date().toISOString().split('T')[0],
        boardSize: DEFAULT_BOARD_SIZE,
        board: Array.from({ length: DEFAULT_BOARD_SIZE }, () => Array(DEFAULT_BOARD_SIZE).fill('')),
        guess: Array.from({ length: DEFAULT_BOARD_SIZE }, () => Array(DEFAULT_BOARD_SIZE).fill('')),
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    console.log("settings", settings);
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
                if (data.gameStatus === "won") {
                    setSettings(prev => ({
                        ...prev,
                        guess: coordinatesToBoard(data.solutionCoordinates || [], settings.boardSize),
                        stars: data.stars || 0
                    }));
                }
                
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch game settings'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchGameSettings();
    }, [settings.date, settings.boardSize]);

    const updateSettings = (updates: Partial<GameSettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    };

    const takeHint = async (x: number, y: number): Promise<boolean> => {
        if (settings.board[x][y] !== '' || settings.hints >= MAX_HINTS[settings.boardSize]) return false;
        if(settings.gameStatus === "tile-loading") return false;
        try {
            setLoadingCoordinates({ x, y });
            updateSettings({ hints: settings.hints + 1 });
            const data = await getHint(settings.date, settings.boardSize, x, y);
            const newBoard = [...settings.board];
            newBoard[x][y] = data.adjacentCount.toString();
            updateSettings({ board: newBoard });
            return true;
        } catch (error) {
            console.error('Error fetching hint:', error);
            // updateSettings({ hints: settings.hints - 1 });
            return false;
        } finally {
            setLoadingCoordinates(undefined);
        }
    };

    const makeGuess = async () => {
        try {
            updateSettings({ gameStatus: "guess-loading" });
            const [response,] = await Promise.all([
                checkGuess(settings.date, settings.boardSize, settings.guess, settings.hints),
                new Promise(resolve => setTimeout(resolve, 2000))
            ]);
            
            switch(response.gameStatus){
                case "won":
                    updateSettings({
                        board: settings.guess,
                        gameStatus: "won",
                        stars: response.stars,
                        statistics: response.statistics
                    });
                    return { success: true, won: true };
                case "lost":
                    break;
            }

            updateSettings({
                hints: response.hintCount,
                gameStatus: response.gameStatus,
                statistics: response.statistics
            });

            return { success: true, won: false };
        } catch (error) {
            console.error('Error checking guess:', error);
            return { success: false, won: false };
        }
    };

    const updateGuess = (x: number, y: number, value: string) => {
        const newGuess = [...settings.guess];
        newGuess[x][y] = value;
        updateSettings({ guess: newGuess });
    };

    const value = {
        settings,
        isLoading,
        error,
        updateSettings,
        takeHint,
        makeGuess,
        updateGuess,
        loadingCoordinates
    };

    return (
        <GameSettingsContext.Provider value={value}>
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
