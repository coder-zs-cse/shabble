
import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
  } from "axios";
  import { envConfig } from "@/lib/config/envConfig";

  const createAxiosInstance = (
    baseURL: string
  ): AxiosInstance => {

    const instance = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  
    instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const userId = localStorage.getItem("userId");
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
        const newUserId = response.headers['x-user-id'] || response.data?.userId;
        if (newUserId) {
          localStorage.setItem("userId", newUserId);
        }
        return response;
      },
      (error: AxiosError) => Promise.reject(error)
    );
  
    return instance;
  };
  
  // Instances for BASE_URL
  export const axiosSecure = createAxiosInstance(envConfig.BASE_URL!);
  export const axiosOpen = createAxiosInstance(envConfig.BASE_URL!);
  