
import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
  } from "axios";
  // import { getUserId } from "@/api/user";
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

    }
  
    return instance;
  };
  
  // Instances for BASE_URL
  export const axiosSecure = createAxiosInstance(envConfig.BASE_URL!, true);
  export const axiosOpen = createAxiosInstance(envConfig.BASE_URL!);
  