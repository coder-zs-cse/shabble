import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";
import { envConfig } from "@/lib/config/envConfig";
import { getSession } from "next-auth/react";

const createAxiosInstance = (
    baseURL: string,
    secure: boolean = false
): AxiosInstance => {

    const instance = axios.create({
        baseURL: baseURL,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    if (secure) {
        instance.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                try {
                    // Prefer authenticated session userId over anonymous localStorage id
                    const session = await getSession();
                    const userId = session?.user?.id ?? localStorage.getItem("userId");
                    if (userId) {
                        config.headers.set("userId", userId);
                    }
                } catch (error) {
                    console.error("Failed to get userId:", error);
                }
                return config;
            },
            (error: AxiosError) => Promise.reject(error)
        );

        instance.interceptors.response.use(
            (response) => {
                const newUserId = response.headers['x-user-id'];
                if (newUserId) {
                    localStorage.setItem("userId", newUserId);
                }
                return response;
            },
            (error: AxiosError) => Promise.reject(error)
        );
    }

    return instance;
};

export const axiosSecure = createAxiosInstance(envConfig.BASE_URL!, true);
export const axiosOpen = createAxiosInstance(envConfig.BASE_URL!);
