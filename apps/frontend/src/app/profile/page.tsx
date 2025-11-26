"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { User, Mail, Calendar, Award, BookOpen, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/api/user";
import { getUserStats } from "@/lib/api/quiz";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: getUserStats,
  });

  if (profileLoading || statsLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">Loading profile...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const user = profileData?.data;
  const stats = statsData?.data;

  if (!user) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="text-center py-12">User not found</div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // Use stats from quiz service if available, fallback to user profile data
  const totalXp = stats?.totalXp || user.xp || 0;
  const quizzesCompleted = stats?.quizzesCompleted || 0;
  const averageScore = stats?.averageScore || 0;
  
  // Calculate level based on XP (simple formula: level = floor(sqrt(xp/100)))
  // or use the level from user profile if backend calculates it
  const level = user.level || Math.floor(Math.sqrt(totalXp / 100)) || 1;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your account and view your achievements
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
            <div className="px-6 pb-6 -mt-16">
              <div className="flex items-end space-x-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-4 border-white flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
                  ) : (
                    (user.firstName?.[0] || user.username?.[0] || "U").toUpperCase()
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-600">@{user.username}</p>
                  <p className="text-sm text-primary-600 font-medium mt-1">Level {level}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="font-medium text-gray-900 truncate" title={user.email}>{user.email}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">Joined</span>
                  </div>
                  <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Award className="w-4 h-4 mr-2" />
                    <span className="text-sm">Total XP</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {totalXp.toLocaleString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Target className="w-4 h-4 mr-2" />
                    <span className="text-sm">Avg Score</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {averageScore}%
                  </p>
                </div>
              </div>
              
              {user.profile?.bio && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Bio</h3>
                  <p className="text-gray-600">{user.profile.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Quizzes Completed</p>
              <p className="text-3xl font-bold text-gray-900">
                {quizzesCompleted}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <Target className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">
                {averageScore}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <Award className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Current Level</p>
              <p className="text-3xl font-bold text-gray-900">
                {level}
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
