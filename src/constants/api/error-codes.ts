export const ERROR_CODES = {
    USER_NOT_FOUND: 1001,
    PUZZLE_NOT_FOUND: 1002,
    VALIDATION_ERROR: 1003,
    INTERNAL_SERVER_ERROR: 1004,
    USER_CREATION_FAILED: 1005,
} as const;

export const ERROR_MESSAGES: Record<number, string> = {
    [ERROR_CODES.USER_NOT_FOUND]: "User not found",
    [ERROR_CODES.PUZZLE_NOT_FOUND]: "Puzzle not found",
    [ERROR_CODES.VALIDATION_ERROR]: "Validation failed",
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: "Internal server error",
    [ERROR_CODES.USER_CREATION_FAILED]: "Failed to create user",
};
