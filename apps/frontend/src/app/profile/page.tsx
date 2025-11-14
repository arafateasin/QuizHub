"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { User, Mail, Calendar, Award, BookOpen, Target } from "lucide-react";

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "Student User",
    email: "user@example.com",
    joinDate: "January 2024",
    xp: 5420,
    level: 12,
    quizzesCompleted: 45,
    averageScore: 82,
    badges: [
      { name: "Quiz Master", icon: "🏆", earned: true },
      { name: "Perfect Score", icon: "💯", earned: true },
      { name: "Speed Demon", icon: "⚡", earned: true },
      { name: "Consistent", icon: "📅", earned: false },
      { name: "Top 10", icon: "🥇", earned: false },
      { name: "Century", icon: "💪", earned: false },
    ],
  };

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
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-4 border-white flex items-center justify-center text-white text-4xl font-bold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h2>
                  <p className="text-gray-600">Level {user.level}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">Joined</span>
                  </div>
                  <p className="font-medium text-gray-900">{user.joinDate}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Award className="w-4 h-4 mr-2" />
                    <span className="text-sm">Total XP</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {user.xp.toLocaleString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Target className="w-4 h-4 mr-2" />
                    <span className="text-sm">Avg Score</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {user.averageScore}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Quizzes Completed</p>
              <p className="text-3xl font-bold text-gray-900">
                {user.quizzesCompleted}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <Target className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">
                {user.averageScore}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <Award className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Badges Earned</p>
              <p className="text-3xl font-bold text-gray-900">
                {user.badges.filter((b) => b.earned).length}/
                {user.badges.length}
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">
              Badges & Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {user.badges.map((badge, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    badge.earned
                      ? "border-primary-200 bg-primary-50 hover:shadow-md"
                      : "border-gray-200 bg-gray-50 opacity-50"
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="font-semibold text-gray-900">{badge.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {badge.earned ? "Earned!" : "Locked"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="text-center text-sm text-gray-500 italic">
            Note: This is mock data. Real profile data will sync with backend
            when MongoDB is connected.
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
