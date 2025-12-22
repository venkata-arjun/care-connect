import { CONFIG } from "./config";
import { getToken, clearAuth } from "./auth";

// Use axios from CDN (attached to window)
const axiosInstance = window.axios.create({ baseURL: CONFIG.BASE_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearAuth();
      if (!location.hash.startsWith("#/login")) location.hash = "#/login";
    }
    return Promise.reject(error);
  }
);

export const api = axiosInstance;
