import { axiosOpen } from "./axios";
import { API_LEADERBOARD } from "@/constants";
import type { LeaderboardEntry } from "@/services";

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    const response = await axiosOpen.get<{ entries: LeaderboardEntry[] }>(API_LEADERBOARD);
    return response.data.entries;
}
