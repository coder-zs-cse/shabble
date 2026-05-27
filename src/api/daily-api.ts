import { API_GAME_STATUS, API_HINT, API_CHECK_GUESS } from "@/constants";
import { axiosSecure } from "./axios";
import { ApiResponse, checkGuessResponse, GameStatusResponse, getHintResponse } from "@/types";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const getGameStatus = async (date: string, boardSize: number): Promise<GameStatusResponse> => {
    try {
        const response = await axiosSecure.get<ApiResponse<GameStatusResponse>>(`${API_GAME_STATUS}?date=${date}&boardSize=${boardSize}`);
        return response.data.data!;
    } catch (error) {
        if (error instanceof AxiosError) {
            const apiError = (error.response?.data as ApiResponse<unknown>)?.error;
            toast.error(apiError?.message ?? "Something went wrong");
        }
        console.error('Error fetching game settings:', error);
        throw error;
    }
}

export const getHint = async (puzzleId: number, x: number, y: number): Promise<getHintResponse> => {
    try {
        const response = await axiosSecure.get<ApiResponse<getHintResponse>>(`${API_HINT}?puzzleId=${puzzleId}&x=${x}&y=${y}`);
        return response.data.data!;
    } catch (error) {
        if (error instanceof AxiosError) {
            const apiError = (error.response?.data as ApiResponse<unknown>)?.error;
            toast.error(apiError?.message ?? "Something went wrong");
        }
        console.error('Error fetching hint:', error);
        throw error;
    }
}

export const checkGuess = async (puzzleId: number, guess: string[][], attempts: number): Promise<checkGuessResponse> => {
    try {
        const response = await axiosSecure.post<ApiResponse<checkGuessResponse>>(`${API_CHECK_GUESS}`, { puzzleId, guess, attempts });
        return response.data.data!;
    } catch (error) {
        if (error instanceof AxiosError) {
            const apiError = (error.response?.data as ApiResponse<unknown>)?.error;
            toast.error(apiError?.message ?? "Something went wrong");
        }
        console.error('Error checking guess:', error);
        throw error;
    }
}
