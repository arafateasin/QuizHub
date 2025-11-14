import { apiClient, ApiResponse, PaginatedResponse } from "../api-client";

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  createdBy: string;
  isPublic: boolean;
  timeLimit?: number;
  passingScore: number;
  questions: Question[];
  tags: string[];
  totalAttempts: number;
  averageScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  _id?: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface QuizAttempt {
  _id: string;
  quizId: string;
  userId: string;
  answers: Answer[];
  score: number;
  percentage: number;
  isPassed: boolean;
  startedAt: string;
  completedAt: string;
  timeSpent: number;
  xpEarned: number;
}

export interface Answer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent?: number;
}

// Get all quizzes
export const getQuizzes = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  search?: string;
}): Promise<PaginatedResponse<Quiz>> => {
  const response = await apiClient.get("/quizzes", { params });
  return response.data;
};

// Get quiz by ID
export const getQuizById = async (
  id: string,
  includeAnswers = false
): Promise<ApiResponse<Quiz>> => {
  const response = await apiClient.get(`/quizzes/${id}`, {
    params: { includeAnswers },
  });
  return response.data;
};

// Get my created quizzes
export const getMyQuizzes = async (): Promise<ApiResponse<Quiz[]>> => {
  const response = await apiClient.get("/quizzes/user/my-quizzes");
  return response.data;
};

// Create quiz
export const createQuiz = async (
  quiz: Omit<
    Quiz,
    | "_id"
    | "createdBy"
    | "totalAttempts"
    | "averageScore"
    | "createdAt"
    | "updatedAt"
  >
): Promise<ApiResponse<Quiz>> => {
  const response = await apiClient.post("/quizzes", quiz);
  return response.data;
};

// Update quiz
export const updateQuiz = async (
  id: string,
  quiz: Partial<Quiz>
): Promise<ApiResponse<Quiz>> => {
  const response = await apiClient.put(`/quizzes/${id}`, quiz);
  return response.data;
};

// Delete quiz
export const deleteQuiz = async (id: string): Promise<ApiResponse> => {
  const response = await apiClient.delete(`/quizzes/${id}`);
  return response.data;
};

// Start quiz attempt
export const startAttempt = async (
  quizId: string
): Promise<ApiResponse<QuizAttempt>> => {
  const response = await apiClient.post("/attempts/start", { quizId });
  return response.data;
};

// Submit quiz attempt
export const submitAttempt = async (
  attemptId: string,
  answers: Omit<Answer, "isCorrect" | "pointsEarned">[]
): Promise<ApiResponse<QuizAttempt>> => {
  const response = await apiClient.post(`/attempts/${attemptId}/submit`, {
    answers,
  });
  return response.data;
};

// Get attempt details
export const getAttempt = async (
  id: string
): Promise<ApiResponse<QuizAttempt>> => {
  const response = await apiClient.get(`/attempts/${id}`);
  return response.data;
};

// Get user's attempt history
export const getUserAttempts = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<QuizAttempt & { quiz: Quiz }>> => {
  const response = await apiClient.get("/attempts/user/history", { params });
  return response.data;
};
