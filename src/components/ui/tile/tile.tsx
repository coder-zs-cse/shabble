'use client'
import { TileLoader } from '@/components';
import React, { useState } from 'react'
import { tileTv } from './tile.variants';
import { TILE_CORRECT_EMOJI } from '@/constants/daily/game-constants'; // please do not change, it avoids circular dependency

interface TileProps {
  className?: string;
  tileContent?: string;
  guessContent?: string;
  onClick?: () => Promise<void>;
  gameStatus?: string;
  incorrectGuess?: boolean;
}


function Tile({ className, tileContent, guessContent, onClick, gameStatus, incorrectGuess }: TileProps) {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTileStatus = () => {
    switch (gameStatus) {
      case "guess-loading":
        if (guessContent) return "guess-loading";
      case "won":
        if (guessContent) return "won";
      case "guessing":
        return guessContent ? "guess-filled" : "guess-empty";
      case "tile-loading":
        return isLoading ?  "tile-loading" : tileContent ? "tile-filled" : "tile-empty";
      default:
        if (incorrectGuess && guessContent) return "guess-incorrect";
        return (tileContent) ? "tile-filled" : "tile-empty";
    }
  };

  const handleTileClick = async (): Promise<void> => {
    setIsLoading(true);
    if(onClick) await onClick()
    setIsLoading(false);
  }

  const getTileContent = () => {
    if (gameStatus === "won" && guessContent) return TILE_CORRECT_EMOJI;
    if (gameStatus === "tile-loading") {
      return tileContent ? tileContent : isLoading ? <TileLoader /> : '';
    }
    if (["playing", "lost"].includes(gameStatus || "") && tileContent) return tileContent;
    if (["guessing", "guess-loading"].includes(gameStatus || "") && tileContent && tileContent !== 'X') return tileContent;
    return '';
  };

  const tileStatus = getTileStatus();

  return (
    <div
      onClick={handleTileClick}
      className={tileTv({
        status: tileStatus,
        gameComplete: ["won", "lost"].includes(gameStatus || ""),
        className
      })}
    >
      {getTileContent()}
    </div>
  )
}

export default Tile