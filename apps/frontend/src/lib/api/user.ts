import { apiClient, ApiResponse, PaginatedResponse } from "../api-client";

export interface User {
  _id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: "user" | "admin";
  profile: {
    bio?: string;
    institution?: string;
    grade?: string;
    interests?: string[];
  };
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  createdAt: string;
  updatedAt: string;
}

// Get current user profile
export const getProfile = async (): Promise<ApiResponse<User>> => {
  const response = await apiClient.get("/users/profile");
  return response.data;
};

// Update user profile
export const updateProfile = async (
  data: Partial<User>
): Promise<ApiResponse<User>> => {
  const response = await apiClient.put("/users/profile", data);
  return response.data;
};

// Get user by ID
export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

// Get all users (admin only)
export const getUsers = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<User>> => {
  const response = await apiClient.get("/users", { params });
  return response.data;
};
