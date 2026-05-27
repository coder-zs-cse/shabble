
import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
  } from "axios";
  import { getUserId } from "@/api/user";
  import { envConfig } from "@/lib/config/envConfig";

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
            let userId = localStorage.getItem("userId");
            let authToken = localStorage.getItem("authToken");
            
            // Auto-provision if missing
            if (!userId || !authToken) {
                await getUserId();
                userId = localStorage.getItem("userId");
                authToken = localStorage.getItem("authToken");
            }

            if (userId) {
                config.headers.set("userId", userId);
            }
            if (authToken) {
                config.headers.set("Authorization", `Bearer ${authToken}`);
            }
          } catch (error) {
            console.error("Failed to get auth credentials:", error);
          }
          return config;
        },
        (error: AxiosError) => Promise.reject(error)
      );

      instance.interceptors.response.use(
        (response) => {
            // Note: with JWT, we no longer need x-user-id header logic, but keeping for safety if any other logic relies on it
            const newUserId = response.headers['x-user-id'];
            if (newUserId) {
                localStorage.setItem("userId", newUserId);
            }
            return response;
        },
        async (error: AxiosError) => {
            if (error.response?.status === 401) {
                // Token is missing or invalid. Clear old data and get new credentials.
                localStorage.removeItem("userId");
                localStorage.removeItem("authToken");
                try {
                    await getUserId();
                    // Optionally reload the page to refresh the game state with the new user
                    window.location.reload();
                } catch (e) {
                    console.error("Failed to recover from 401:", e);
                }
            }
            return Promise.reject(error);
        }
    );
    }
  
    return instance;
  };
  
  // Instances for BASE_URL
  export const axiosSecure = createAxiosInstance(envConfig.BASE_URL!, true);
  export const axiosOpen = createAxiosInstance(envConfig.BASE_URL!);

  