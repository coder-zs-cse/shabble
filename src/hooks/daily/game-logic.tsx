import { useState } from 'react'
import { useGameSettings } from '@/contexts'
import { Confetti } from '@/components'

export function useGameLogic() {
    const { settings, updateSettings, takeHint, makeGuess, updateGuess, loadingCoordinates } = useGameSettings();
    const [incorrectGuess, setIncorrectGuess] = useState<boolean>(false);
    const [showHelp, setShowHelp] = useState<boolean>(true);
    const [showStatistics, setShowStatistics] = useState<boolean>(false);

    const handleTileClick = async (x: number, y: number): Promise<void> => {
        console.log("handleTileClick", settings.gameStatus)
        if(settings.gameStatus === "won" || settings.gameStatus === "lost") {
            return;
        }
        if (settings.gameStatus === "guessing") {
            handleGuessingMode(x, y);
        } else {
            if(loadingCoordinates) return;
            console.log("going to load tile")
            updateSettings({ gameStatus: "tile-loading" });
            console.log("loading tile")
            await takeHint(x, y);
            console.log("loaded tile")
            updateSettings({ gameStatus: "playing" });
        }
    }

    const handleGuessingMode = (x: number, y: number) => {
        if (settings.guess[x][y] !== '') {
            updateGuess(x, y, '');
            updateSettings({ guessTileCount: settings.guessTileCount - 1 });
        } else if (settings.guessTileCount < settings.boardSize) {
            updateGuess(x, y, 'X');
            updateSettings({ guessTileCount: settings.guessTileCount + 1 });
        }
    }

    const handleSubmitButton = async () => {
        if (settings.gameStatus === "won" || settings.gameStatus === "lost") {
            return;
        }

        if (settings.gameStatus === "guessing") {
            const result = await makeGuess();
            if (result.won) {
                Confetti();
            } else if (result.won === false && result.success) {
                handleIncorrectGuess();
            }
        } else {
            updateSettings({ gameStatus: "guessing" });
        }
    }

    const handleIncorrectGuess = () => {
        setIncorrectGuess(true);
        setTimeout(() => {
            setIncorrectGuess(false);
            updateSettings({
                guess: Array.from({ length: settings.boardSize }, () => Array(settings.boardSize).fill('')),
                guessTileCount: 0
            });
        }, 1000);
    }

    return {
        showHelp,
        showStatistics,
        incorrectGuess,
        handleTileClick,
        handleSubmitButton,
        setShowHelp,
        setShowStatistics
    }
}