'use client';
import React from 'react';
import { tv } from 'tailwind-variants'; 

const tileVariants = tv({
    base: 'w-full aspect-square flex items-center justify-center font-bold border rounded-md text-base sm:text-lg select-none transition-all duration-300 transform active:scale-95 cursor-pointer',
    variants: {
        variant: {
            default: 'bg-emerald-100/70 hover:bg-emerald-200/80 border-emerald-200 text-transparent',
            radar: 'animate-pulse bg-amber-100 border-amber-400 text-amber-700 scale-102 z-10 shadow-sm',
            hintLoaded: 'bg-amber-500 text-white border-amber-600 shadow-sm',
            userGuess: 'bg-emerald-600 text-white border-emerald-700',
            wrongMark: 'animate-pulse bg-red-500 text-white border-red-600 shadow-md font-extrabold'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});

interface TileProps {
    rowIndex: number;
    colIndex: number;
    tileContent: string;   
    guessContent?: string;  
    gameStatus: string;     
    isLoading?: boolean;
    isNeighbor?: boolean;
    isSolutionTarget: boolean;
    onClick?: () => void;
    className?: string;
}

export default function Tile({
    tileContent,
    guessContent,
    gameStatus,
    isLoading,
    isNeighbor,
    isSolutionTarget,
    onClick,
    className
}: TileProps) {

    const isGameOver = gameStatus === "won" || gameStatus === "lost";

    const getVariantState = () => {
        // --- PHASE 3: ENDGAME ---
        if (isGameOver) {
            if (guessContent === "X" && !isSolutionTarget) return "wrongMark"; 
            if (isSolutionTarget) return "userGuess"; 
            if (tileContent !== "") return "hintLoaded"; 
            return "default";
        }

        // --- ACTIVE RADAR PULSE STATE ---
        if (gameStatus === "tile-loading" && isNeighbor) {
            return "radar";
        }

        // --- PHASE 2: MAKE GUESS GAMEPLAY ---
        // Prioritize showing userGuess color even if the tile has an underlying hint number
        if (gameStatus === "guessing" && guessContent === "X") {
            return "userGuess"; 
        }

        // --- PHASE 1: ACTIVE HINT GAMEPLAY ---
        if (tileContent !== "") return "hintLoaded"; 
        
        return "default";
    };

    const getTileContent = () => {
        // Show a loader ellipsis string inside the center cell that was directly clicked
        if (gameStatus === "tile-loading" && isLoading) return '...';

        // --- PHASE 3: ENDGAME TEXT REPORTING ---
        if (isGameOver) {
            if (guessContent === "X" && isSolutionTarget) return ".";
            if (guessContent === "X" && !isSolutionTarget) return "X";
            if (isSolutionTarget) return "";
        }

        // --- LIVE GAMEPLAY TEXT REPORTING ---
        // If the user selects this tile during guessing mode, hide the underlying hint number to show the green guess style cleanly
        if (gameStatus === "guessing" && guessContent === "X") return ""; 
        return tileContent || ''; 
    };

    return (
        <button 
            type="button"
            onClick={onClick}
            className={tileVariants({ variant: getVariantState(), className })}
            disabled={
                isGameOver || 
                gameStatus === "guess-loading" ||
                gameStatus === "tile-loading" || 
                (gameStatus === "playing" && tileContent !== "") // Only disable clicked hint tiles while STILL in discovery phase!
            }
        >
            {getTileContent()}
        </button>
    );
}