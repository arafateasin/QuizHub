import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Get backend JWT from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as any;

    if (error.response) {
      const message =
        error.response.data?.error ||
        error.response.data?.message ||
        "An error occurred";

      switch (error.response.status) {
        case 401:
          // Try to refresh token if not already retrying
          if (typeof window !== "undefined" && !originalRequest._retry) {
            const isAuthPage = window.location.pathname.startsWith("/auth/");

            if (!isAuthPage) {
              const refreshToken = localStorage.getItem("refreshToken");

              if (refreshToken) {
                originalRequest._retry = true;

                try {
                  // Try to refresh the token
                  const response = await axios.post(
                    `${API_URL}/api/auth/refresh`,
                    { refreshToken }
                  );

                  const { accessToken, refreshToken: newRefreshToken } =
                    response.data.data;
                  localStorage.setItem("accessToken", accessToken);
                  if (newRefreshToken) {
                    localStorage.setItem("refreshToken", newRefreshToken);
                  }

                  // Retry the original request with new token
                  originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                  return apiClient(originalRequest);
                } catch (refreshError) {
                  // Refresh failed, clear tokens and redirect
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  toast.error("Session expired. Please login again.");
                  window.location.href = "/auth/login";
                  return Promise.reject(refreshError);
                }
              } else {
                // No refresh token, redirect to login
                toast.error("Please login to continue");
                window.location.href = "/auth/login";
              }
            }
          }
          break;
        case 403:
          toast.error("You don't have permission to perform this action");
          break;
        case 404:
          toast.error("Resource not found");
          break;
        case 429:
          toast.error("Too many requests. Please try again later.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(message);
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred");
    }

    return Promise.reject(error);
  }
);

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
