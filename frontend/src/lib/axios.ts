// lib/axios.ts
import axios from "axios";
// import { useAuth } from "@clerk/clerk-react";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:8080/api" : "/api",
});

// Call this once in your app to set up the interceptor
export const setupAxiosInterceptors = (getToken: () => Promise<string | null>) => {
  axiosInstance.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};