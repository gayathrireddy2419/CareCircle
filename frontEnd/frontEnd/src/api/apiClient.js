import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8090";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Automatically attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error handling (401, 403, 404, 500)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn("Unauthorized API call - invalid token or insufficient privileges.", error.response.config?.url);
      } else if (status === 403) {
        console.error("Forbidden resource/action.", error.response.config?.url);
      } else if (status === 404) {
        console.error("Requested resource not found.", error.response.config?.url);
      } else if (status === 503) {
        console.warn("Service temporarily unavailable:", error.response.config?.url);
      } else if (status >= 500) {
        console.error("Backend Server error occurred.", error.response.config?.url);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
