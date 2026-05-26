import { getGameStatus, updateUserProgress, getUserProgress } from "./game/game";

export {
    getGameStatus,
    updateUserProgress,
    getUserProgress
}

import {
    getCurrentBoard,
    getAdjacentCount,
    checkGuess
} from "./game/puzzle";

export {
    getCurrentBoard,
    getAdjacentCount,
    checkGuess
};

import {
    createUser,
    upsertGoogleUser,
    incrementPlayedCount,
    updateStreak,
    updateStars,
    getStatistics,
    getLeaderboard
} from "./user/user";

export {
    createUser,
    upsertGoogleUser,
    incrementPlayedCount,
    updateStreak,
    updateStars,
    getStatistics,
    getLeaderboard
};

