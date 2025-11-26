"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import { getAttempt, getQuizById } from "@/lib/api/quiz";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Trophy,
  Clock,
  Award,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";
import Link from "next/link";

export default function QuizResultPage({
  params,
}: {
  params: { id: string; attemptId: string };
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <QuizResultContent quizId={params.id} attemptId={params.attemptId} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function QuizResultContent({
  quizId,
  attemptId,
}: {
  quizId: string;
  attemptId: string;
}) {
  const router = useRouter();

  const { data: attemptData, isLoading: attemptLoading } = useQuery({
    queryKey: ["attempt", attemptId],
    queryFn: () => getAttempt(attemptId),
  });

  const { data: quizData, isLoading: quizLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuizById(quizId),
  });

  if (attemptLoading || quizLoading) {
    return <div className="text-center py-12">Loading results...</div>;
  }

  const attempt = attemptData?.data;
  const quiz = quizData?.data;

  if (!attempt || !quiz) {
    return <div className="text-center py-12">Result not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 mb-6">
          {attempt.isPassed ? (
            <Trophy className="w-10 h-10 text-primary-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-500" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {attempt.isPassed ? "Quiz Completed!" : "Keep Practicing!"}
        </h1>
        <p className="text-gray-600 mb-8">
          You scored {attempt.score} out of{" "}
          {quiz.questions.reduce((sum, q) => sum + q.points, 0)} points
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Score</p>
            <p className="text-2xl font-bold text-gray-900">
              {attempt.percentage}%
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Time Spent</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatDuration(
                (new Date(attempt.completedAt).getTime() -
                  new Date(attempt.startedAt).getTime()) /
                  1000
              )}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">XP Earned</p>
            <div className="flex items-center justify-center text-2xl font-bold text-yellow-600">
              <Award className="w-6 h-6 mr-1" />
              {attempt.xpEarned}
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            href="/dashboard"
            className="btn-secondary flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <Link
            href={`/quiz/${quizId}`}
            className="btn-primary"
          >
            Retake Quiz
          </Link>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Detailed Breakdown</h2>
        {quiz.questions.map((question, index) => {
          const answer = attempt.answers.find(
            (a) => a.questionId === question._id
          );
          const isCorrect = answer?.isCorrect;

          return (
            <div
              key={question._id}
              className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
                isCorrect ? "border-green-500" : "border-red-500"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-500 mb-1 block">
                    Question {index + 1}
                  </span>
                  <h3 className="text-lg font-medium text-gray-900">
                    {question.text}
                  </h3>
                </div>
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 ml-4" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 ml-4" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="w-24 text-gray-500">Your Answer:</span>
                  <span
                    className={`font-medium ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {String(answer?.userAnswer || "Skipped")}
                  </span>
                </div>
                {!isCorrect && (
                  <div className="flex items-center text-sm">
                    <span className="w-24 text-gray-500">Correct:</span>
                    <span className="font-medium text-green-600">
                      {String(question.correctAnswer)}
                    </span>
                  </div>
                )}
                {question.explanation && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      Explanation:{" "}
                    </span>
                    {question.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
