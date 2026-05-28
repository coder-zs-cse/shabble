import { API_GAME_STATUS, API_HINT, API_CHECK_GUESS } from "@/constants";
import { axiosSecure } from "./axios";
import { checkGuessResponse, GameStatusResponse, getHintResponse } from "@/types";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

// ------------------------------------------------------------------
// CLIENT-SIDE OFFLINE ENGINE (FOR ZERO-DATABASE / OFFLINE HYBRID)
// ------------------------------------------------------------------

interface OfflinePuzzleState {
    puzzleId: number;
    date: string;
    boardSize: number;
    board: { x: number; y: number }[];
    hintCoordinates: { x: number; y: number; c: number }[];
    gameStatus: "playing" | "won" | "lost";
    stars: number;
}

// Generate connected layout coordinates of length `boardSize`
const fetchOfflineBoard = (boardSize: number): { x: number; y: number }[] => {
    const randomCoordinates: { x: number; y: number }[] = [];
    const startX = Math.floor(Math.random() * boardSize);
    const startY = Math.floor(Math.random() * boardSize);
    randomCoordinates.push({ x: startX, y: startY });

    const targetCount = boardSize;

    while (randomCoordinates.length < targetCount) {
        const randIndex = Math.floor(Math.random() * randomCoordinates.length);
        const lastCoord = randomCoordinates[randIndex];
        const directions = [
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 }
        ];
        directions.sort(() => Math.random() - 0.5);
        for (const { dx, dy } of directions) {
            const newX = lastCoord.x + dx;
            const newY = lastCoord.y + dy;
            if (
                newX >= 0 && newX < boardSize &&
                newY >= 0 && newY < boardSize &&
                !randomCoordinates.some(coord => coord.x === newX && coord.y === newY)
            ) {
                randomCoordinates.push({ x: newX, y: newY });
                break;
            }
        }
    }
    return randomCoordinates;
};

// Calculate MineSweeper adjacent clues
const getOfflineAdjacentCount = (board: { x: number; y: number }[], boardSize: number, x: number, y: number): number => {
    let adjacentCount = 0;
    const directions = [
        { x: -1, y: 0 }, { x: -1, y: -1 }, { x: -1, y: 1 },
        { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 1, y: 1 },
        { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 0, y: 0 }
    ];
    directions.forEach(({ x: dx, y: dy }) => {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize) {
            adjacentCount += board.some(({ x: cx, y: cy }) => cx === newX && cy === newY) ? 1 : 0;
        }
    });
    return adjacentCount;
};

// Get offline persistent statistics
const getOfflineStats = () => {
    if (typeof window === 'undefined') {
        return { played: 0, totalStars: 0, currentStreak: 0, bestStreak: 0, starDistribution: [0, 0, 0, 0, 0, 0] };
    }
    const saved = localStorage.getItem('shabble-offline-stats');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch {
            // fallback
        }
    }
    return { played: 0, totalStars: 0, currentStreak: 0, bestStreak: 0, starDistribution: [0, 0, 0, 0, 0, 0] };
};

const saveOfflineStats = (stats: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('shabble-offline-stats', JSON.stringify(stats));
};

// Main Offline Puzzle Loader
const getOrCreateOfflinePuzzle = (date: string, boardSize: number): OfflinePuzzleState => {
    const key = `shabble-offline-puzzle-${date}-${boardSize}`;
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {}
        }
    }

    // Create fresh
    const board = fetchOfflineBoard(boardSize);
    const freshPuzzle: OfflinePuzzleState = {
        puzzleId: -Math.floor(1000 + Math.random() * 9000), // unique negative offline ID
        date,
        boardSize,
        board,
        hintCoordinates: [],
        gameStatus: "playing",
        stars: 0
    };

    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(freshPuzzle));
    }
    return freshPuzzle;
};

const saveOfflinePuzzle = (state: OfflinePuzzleState) => {
    if (typeof window === 'undefined') return;
    const key = `shabble-offline-puzzle-${state.date}-${state.boardSize}`;
    localStorage.setItem(key, JSON.stringify(state));
};

// ------------------------------------------------------------------
// EXPORTED RESILIENT API LAYERS
// ------------------------------------------------------------------

let offlineWarningShown = false;

export const getGameStatus = async (date: string, boardSize: number): Promise<GameStatusResponse> => {
    try {
        const response = await axiosSecure.get(`${API_GAME_STATUS}?boardSize=${boardSize}`);
        return response.data;
    } catch (error) {
        console.warn('Axios server fetch failed, activating resilient Offline Fallback Engine:', error);
        
        if (typeof window !== 'undefined' && !offlineWarningShown) {
            toast.info("Database is offline. Offline sandbox mode activated: spelling daily virtual matrices!");
            offlineWarningShown = true;
        }

        const offlinePuzzle = getOrCreateOfflinePuzzle(date, boardSize);
        const stats = getOfflineStats();

        const solutionCoordinates = offlinePuzzle.gameStatus === "won" 
            ? offlinePuzzle.board.map(({ x, y }) => ({ x, y }))
            : undefined;

        return {
            puzzleId: offlinePuzzle.puzzleId,
            hintCoordinates: offlinePuzzle.hintCoordinates,
            hintCount: offlinePuzzle.hintCoordinates.length,
            gameStatus: offlinePuzzle.gameStatus,
            solutionCoordinates,
            stars: offlinePuzzle.stars || undefined,
            statistics: stats
        };
    }
}

export const getHint = async (puzzleId: number, x: number, y: number): Promise<getHintResponse> => {
    try {
        if (puzzleId >= 0) {
            const response = await axiosSecure.get(`${API_HINT}?puzzleId=${puzzleId}&x=${x}&y=${y}`);
            return response.data;
        }
        throw new Error("Trigger offline fallback");
    } catch (error) {
        const dateKey = new Date().toISOString().split('T')[0];
        let matchedPuzzle: OfflinePuzzleState | null = null;
        
        if (typeof window !== 'undefined') {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("shabble-offline-puzzle-")) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key)!) as OfflinePuzzleState;
                        if (data.puzzleId === puzzleId) {
                            matchedPuzzle = data;
                            break;
                        }
                    } catch {}
                }
            }
        }

        if (!matchedPuzzle) {
            matchedPuzzle = getOrCreateOfflinePuzzle(dateKey, 5);
        }

        const adjacentCount = getOfflineAdjacentCount(matchedPuzzle.board, matchedPuzzle.boardSize, x, y);
        
        if (!matchedPuzzle.hintCoordinates.some(h => h.x === x && h.y === y)) {
            matchedPuzzle.hintCoordinates.push({ x, y, c: adjacentCount });
            saveOfflinePuzzle(matchedPuzzle);
        }

        return {
            adjacentCount,
            hintCount: matchedPuzzle.hintCoordinates.length
        };
    }
}

export const checkGuess = async (puzzleId: number, guess: string[][], attempts: number): Promise<checkGuessResponse> => {
    try {
        if (puzzleId >= 0) {
            const response = await axiosSecure.post(`${API_CHECK_GUESS}`, { puzzleId, guess, attempts });
            return response.data;
        }
        throw new Error("Trigger offline fallback");
    } catch (error) {
        let matchedPuzzle: OfflinePuzzleState | null = null;
        
        if (typeof window !== 'undefined') {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("shabble-offline-puzzle-")) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key)!) as OfflinePuzzleState;
                        if (data.puzzleId === puzzleId) {
                            matchedPuzzle = data;
                            break;
                        }
                    } catch {}
                }
            }
        }

        if (!matchedPuzzle) {
            matchedPuzzle = getOrCreateOfflinePuzzle(new Date().toISOString().split('T')[0], 5);
        }

        const isCorrect = matchedPuzzle.board.every(({ x, y }) => guess[x][y] === 'X');
        const stats = getOfflineStats();

        if (isCorrect) {
            matchedPuzzle.gameStatus = "won";
            
            const hintsUsed = matchedPuzzle.hintCoordinates.length;
            const stars = hintsUsed <= 1 ? 3 : hintsUsed <= 3 ? 2 : 1;
            matchedPuzzle.stars = stars;
            saveOfflinePuzzle(matchedPuzzle);

            stats.played += 1;
            stats.totalStars += stars;
            stats.currentStreak += 1;
            stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
            stats.starDistribution[stars] += 1;
            saveOfflineStats(stats);

            return {
                isCorrect: true,
                hintCount: hintsUsed,
                gameStatus: "won",
                stars,
                statistics: stats
            };
        } else {
            return {
                isCorrect: false,
                hintCount: matchedPuzzle.hintCoordinates.length,
                gameStatus: "playing",
                statistics: stats
            };
        }
    }
}