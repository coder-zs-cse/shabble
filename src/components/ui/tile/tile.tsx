'use client'
import React from 'react'
import { tv } from 'tailwind-variants'

interface TileProps {
  className?: string;
  tileContent?: string;
  guessContent?: string;
  onClick?: () => Promise<void>;
  gameStatus?: string;
  incorrectGuess?: boolean;
  isRadarHighlighted?: boolean;
  isRevealedHint?: boolean;
}

const tileStyles = tv({
  base: "flex items-center justify-center rounded-md sm:rounded-xl md:rounded-xl font-black text-2xl md:text-4xl text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.1)] transition-all duration-200 select-none min-h-[45px] w-full h-full",
  variants: {
    status: {
      "tile-empty": "bg-gray-200 dark:bg-gray-800",
      "tile-filled": "bg-yellow-500 dark:bg-yellow-600 text-white",
      "guess-empty": "bg-green-200",
      "guess-filled": "bg-green-600",
      "guess-loading": "animate-guessLoading",
      "guess-incorrect": "bg-red-600 animate-shake",
      "won": "bg-green-600",
      "tile-radar": "animate-radar"
    },
    gameComplete: {
      true: "",
      false: "cursor-pointer"
    }
  },
  defaultVariants: {
    status: "tile-empty",
    gameComplete: false
  }
})

export default function Tile({ className, tileContent, guessContent, onClick, gameStatus, incorrectGuess, isRadarHighlighted, isRevealedHint }: TileProps) {
  
  const getTileStatus = () => {
    
    if (guessContent && guessContent !== '') {
      if (gameStatus === "guess-loading") return "guess-loading";
      if (gameStatus === "won") return "won";
      if (incorrectGuess) return "guess-incorrect";
      return "guess-filled";
    }

    
    if (isRevealedHint || (tileContent && tileContent !== '')) return "tile-filled";
    if (isRadarHighlighted) return "tile-radar";

    switch (gameStatus) {
      case "guess-loading": return "guess-empty";
      case "won": return "tile-empty";
      case "guessing": return "guess-empty";
      default:
        return "tile-empty";
    }
  };

  const tileStatus = getTileStatus();

  return (
    <div
     
      onClick={() => { if (onClick) onClick(); }}
      className={tileStyles({
        status: getTileStatus(),
        gameComplete: ["won", "lost"].includes(gameStatus || ""),
        className
      })}
    >
      
      {gameStatus === "won" && guessContent ? "🎉" : (guessContent || tileContent || '')}
    </div>
  );
}