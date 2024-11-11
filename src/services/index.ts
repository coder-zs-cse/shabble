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
    incrementPlayedCount,
    updateStreak,
    updateStars,
    getStatistics
} from "./user/user";

export {
    createUser,
    incrementPlayedCount,
    updateStreak,
    updateStars,
    getStatistics
};

