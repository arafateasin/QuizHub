"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

export default function LeaderboardPage() {
  // Mock leaderboard data
  const topUsers = [
    { rank: 1, name: "Alex Johnson", xp: 15420, quizzes: 87, avatar: "AJ" },
    { rank: 2, name: "Sarah Williams", xp: 14850, quizzes: 82, avatar: "SW" },
    { rank: 3, name: "Mike Chen", xp: 13990, quizzes: 79, avatar: "MC" },
    { rank: 4, name: "Emma Davis", xp: 12750, quizzes: 71, avatar: "ED" },
    { rank: 5, name: "James Wilson", xp: 11980, quizzes: 68, avatar: "JW" },
    { rank: 6, name: "Olivia Brown", xp: 10850, quizzes: 63, avatar: "OB" },
    { rank: 7, name: "Noah Martinez", xp: 9720, quizzes: 58, avatar: "NM" },
    { rank: 8, name: "Sophia Garcia", xp: 8890, quizzes: 54, avatar: "SG" },
    { rank: 9, name: "Liam Anderson", xp: 8250, quizzes: 51, avatar: "LA" },
    { rank: 10, name: "Ava Taylor", xp: 7640, quizzes: 47, avatar: "AT" },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
              Leaderboard 🏆
            </h1>
            <p className="text-gray-600">
              Top performers based on XP earned from quizzes
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
              <Trophy className="w-8 h-8 text-yellow-600 mb-2" />
              <p className="text-sm text-gray-600">Total Competitors</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Quizzes Completed</p>
              <p className="text-2xl font-bold text-gray-900">8,642</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <Award className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Total XP Earned</p>
              <p className="text-2xl font-bold text-gray-900">1.2M</p>
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-200">
              <h2 className="text-xl font-heading font-bold text-gray-900">
                Top 10 Users
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {topUsers.map((user) => (
                <div
                  key={user.rank}
                  className={`px-6 py-4 flex items-center justify-between transition-all hover:shadow-md border-2 ${getRankBg(
                    user.rank
                  )}`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Rank */}
                    <div className="w-12 flex items-center justify-center">
                      {getRankIcon(user.rank)}
                    </div>

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
                      {user.avatar}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {user.quizzes} quizzes completed
                      </p>
                    </div>

                    {/* XP */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        {user.xp.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">XP</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              How to Climb the Leaderboard
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Complete quizzes to earn XP</li>
              <li>• Higher difficulty quizzes give more XP</li>
              <li>• Perfect scores earn bonus XP</li>
              <li>• Complete daily challenges for extra points</li>
              <li>• Maintain your streak for multiplier bonuses</li>
            </ul>
          </div>

          {/* Note */}
          <div className="text-center text-sm text-gray-500 italic">
            Note: This is mock data. Real leaderboard will be available when the
            Leaderboard Service is implemented.
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
