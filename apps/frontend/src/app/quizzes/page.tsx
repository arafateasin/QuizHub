"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import { getQuizzes } from "@/lib/api/quiz";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Trophy,
  Users,
  ChevronRight,
} from "lucide-react";
import { getDifficultyColor, formatNumber } from "@/lib/utils";

export default function QuizzesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <QuizzesContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function QuizzesContent() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["quizzes", { page, search, category, difficulty }],
    queryFn: () =>
      getQuizzes({ page, limit: 12, search, category, difficulty }),
  });

  const quizzes = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          Browse Quizzes
        </h1>
        <p className="text-gray-600">
          Explore thousands of quizzes across different topics
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="science">Science</option>
            <option value="math">Mathematics</option>
            <option value="history">History</option>
            <option value="programming">Programming</option>
            <option value="language">Language</option>
            <option value="general">General Knowledge</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            aria-label="Filter by difficulty"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Quiz Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No quizzes found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz: any) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function QuizCard({ quiz }: { quiz: any }) {
  return (
    <Link href={`/quiz/${quiz._id}`}>
      <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
              quiz.difficulty
            )}`}
          >
            {quiz.difficulty}
          </span>
          {quiz.timeLimit && (
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {quiz.timeLimit}min
            </div>
          )}
        </div>

        <h3 className="text-lg font-heading font-bold text-gray-900 mb-2 line-clamp-2">
          {quiz.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {quiz.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              {quiz.questions.length}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {formatNumber(quiz.totalAttempts)}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-primary-600" />
        </div>
      </div>
    </Link>
  );
}
