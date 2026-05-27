import { axiosOpen } from "./axios";
import { API_NEW_USER } from "@/constants";

export const getUserId = async () => {
    const userId = localStorage.getItem("userId");
    const authToken = localStorage.getItem("authToken");

    if (!userId || !authToken) {
        try {
            const response = await axiosOpen.put(API_NEW_USER);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("authToken", response.data.token);
            return response.data.userId;
        } catch (error) {
            console.error("Failed to get userId and token:", error);
            throw error;
        }
    }
    return userId;
}