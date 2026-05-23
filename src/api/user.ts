import { axiosOpen } from "./axios";
import { API_NEW_USER } from "@/constants";

let userIdPromise: Promise<string> | null = null;

export const getUserId = async () => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
        return storedUserId;
    }

    if (!userIdPromise) {
        userIdPromise = axiosOpen.put(API_NEW_USER)
            .then((response) => {
                const userId = response.data?.userId || response.headers['x-user-id'];
                if (!userId) {
                    throw new Error("Failed to get userId from response");
                }
                localStorage.setItem("userId", userId);
                return userId;
            })
            .catch((error) => {
                console.error("Failed to get userId:", error);
                throw error;
            })
            .finally(() => {
                userIdPromise = null;
            });
    }

    return userIdPromise;
};