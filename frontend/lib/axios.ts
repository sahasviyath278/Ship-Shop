import axios, { AxiosInstance } from "axios";

let apiInstance: AxiosInstance | null = null;

function initializeApi(): AxiosInstance {
  if (apiInstance) return apiInstance;

  apiInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

  apiInstance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const { useAuthStore } = require("@/store/authStore");
      const token = useAuthStore.getState().accessToken;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (typeof window === "undefined") return Promise.reject(error);
      
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const { useAuthStore } = require("@/store/authStore");
        const { refreshToken, setAuth, clearAuth } = useAuthStore.getState();
        if (refreshToken) {
          try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
              accessToken: useAuthStore.getState().accessToken,
              refreshToken,
            });
            setAuth(res.data);
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return apiInstance!(originalRequest);
          } catch {
            clearAuth();
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return apiInstance;
}

export function getApi(): AxiosInstance {
  return initializeApi();
}

export default getApi();