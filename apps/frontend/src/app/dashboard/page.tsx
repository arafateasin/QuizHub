"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { getUserAttempts } from "@/lib/api/quiz";
import { getProfile } from "@/lib/api/user";
import {
  Trophy,
  Zap,
  Target,
  TrendingUp,
  BookOpen,
  Award,
  Clock,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { calculateLevel, xpForNextLevel, formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();

  // Fetch user profile - only when user is authenticated
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !!user, // Only fetch when user exists
    retry: false, // Don't retry on failure
  });

  // Fetch recent attempts - only when user is authenticated
  const { data: attemptsData } = useQuery({
    queryKey: ["attempts", { limit: 5 }],
    queryFn: () => getUserAttempts({ limit: 5 }),
    enabled: !!user, // Only fetch when user exists
    retry: false, // Don't retry on failure
  });

  const profile = (profileData as any)?.data;
  const attempts = (attemptsData as any)?.data || [];

  const userXp = profile?.xp || 0;
  const userLevel = calculateLevel(userXp);
  const xpProgress = xpForNextLevel(userXp);

  // Calculate stats
  const totalQuizzes = attempts.length;
  const passedQuizzes = attempts.filter((a: any) => a.isPassed).length;
  const averageScore =
    totalQuizzes > 0
      ? attempts.reduce((sum: number, a: any) => sum + a.percentage, 0) /
        totalQuizzes
      : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          Welcome back, {user?.displayName || "Student"}! 👋
        </h1>
        <p className="text-gray-600">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Zap className="w-6 h-6 text-yellow-600" />}
          label="Total XP"
          value={formatNumber(userXp)}
          sublabel={`Level ${userLevel}`}
          color="yellow"
        />
        <StatCard
          icon={<Trophy className="w-6 h-6 text-blue-600" />}
          label="Quizzes Completed"
          value={totalQuizzes}
          sublabel={`${passedQuizzes} passed`}
          color="blue"
        />
        <StatCard
          icon={<Target className="w-6 h-6 text-green-600" />}
          label="Average Score"
          value={`${averageScore.toFixed(0)}%`}
          sublabel="Across all quizzes"
          color="green"
        />
        <StatCard
          icon={<Award className="w-6 h-6 text-purple-600" />}
          label="Badges Earned"
          value={profile?.badges?.length || 0}
          sublabel="Keep collecting!"
          color="purple"
        />
      </div>

      {/* XP Progress */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold text-gray-900">
            Level Progress
          </h2>
          <span className="text-sm font-medium text-primary-600">
            Level {userLevel}
          </span>
        </div>
        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
            style={{ width: `${xpProgress.percentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.next)}{" "}
          XP to Level {userLevel + 1}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start New Quiz */}
        <Link
          href="/quizzes"
          className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-shadow group"
        >
          <BookOpen className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-heading font-bold mb-2">
            Start New Quiz
          </h3>
          <p className="text-primary-100">
            Browse thousands of quizzes and test your knowledge!
          </p>
        </Link>

        {/* View Leaderboard */}
        <Link
          href="/leaderboard"
          className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-lg transition-shadow group border border-gray-200"
        >
          <Trophy className="w-12 h-12 mb-4 text-yellow-500 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Leaderboard
          </h3>
          <p className="text-gray-600">
            See how you rank against other learners!
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-heading font-bold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-500" />
            Recent Activity
          </h2>
          <Link
            href="/history"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View All
          </Link>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No quizzes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your first quiz to see your activity here!
            </p>
            <Link
              href="/quizzes"
              className="btn-primary inline-flex items-center"
            >
              Browse Quizzes
              <TrendingUp className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt: any) => (
              <div
                key={attempt._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {attempt.quiz?.title || "Quiz"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {new Date(attempt.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${
                      attempt.percentage >= 70
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {attempt.percentage.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    +{attempt.xpEarned} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel: string;
  color: "yellow" | "blue" | "green" | "purple";
}

function StatCard({ icon, label, value, sublabel, color }: StatCardProps) {
  const colorClasses = {
    yellow: "bg-yellow-50 border-yellow-200",
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
  };

  return (
    <div className={`${colorClasses[color]} rounded-2xl shadow-sm p-6 border`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-heading font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{sublabel}</p>
      </div>
    </div>
  );
}
