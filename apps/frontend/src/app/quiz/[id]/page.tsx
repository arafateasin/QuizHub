"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQuizById, startAttempt, submitAttempt } from "@/lib/api/quiz";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
} from "lucide-react";
import { getDifficultyColor, formatDuration } from "@/lib/utils";
import { toast } from "sonner";
import { trackQuizStarted, trackQuizCompleted } from "@/lib/firebase-analytics";

export default function QuizTakePage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <QuizTakeContent quizId={params.id} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function QuizTakeContent({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  // Fetch quiz details
  const { data: quizData, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuizById(quizId),
  });

  // Start attempt mutation
  const startMutation = useMutation({
    mutationFn: () => startAttempt(quizId),
    onSuccess: (data: any) => {
      if (data.data) {
        setAttemptId(data.data._id);
        setStarted(true);
        setStartTime(Date.now());
        trackQuizStarted(quizId, quiz?.title || "Quiz");
        toast.success("Quiz started! Good luck!");
      }
    },
    onError: () => {
      toast.error("Failed to start quiz");
    },
  });

  // Submit attempt mutation
  const submitMutation = useMutation({
    mutationFn: (answers: any[]) => submitAttempt(attemptId!, answers),
    onSuccess: (data: any) => {
      if (data.data) {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        trackQuizCompleted(quizId, data.data.percentage, duration);
        toast.success("Quiz submitted!");
        router.push(`/quiz/${quizId}/result/${data.data._id}`);
      }
    },
    onError: () => {
      toast.error("Failed to submit quiz");
    },
  });

  const quiz = quizData?.data;
  const questions = quiz?.questions || [];
  const question = questions[currentQuestion];

  // Timer effect
  useEffect(() => {
    if (started && quiz?.timeLimit && timeLeft === null) {
      setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
    }
  }, [started, quiz, timeLeft]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && started) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev! > 0 ? prev! - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, started]);

  const handleAnswer = (answer: any) => {
    setAnswers({
      ...answers,
      [question._id!]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const formattedAnswers = questions.map((q: any) => ({
      questionId: q._id!,
      userAnswer: answers[q._id!] || "",
    }));
    submitMutation.mutate(formattedAnswers);
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="text-center py-12">Quiz not found</div>;
  }

  if (!started) {
    // Quiz overview
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                quiz.difficulty
              )}`}
            >
              {quiz.difficulty}
            </span>
          </div>

          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">
            {quiz.title}
          </h1>
          <p className="text-gray-600 mb-8">{quiz.description}</p>

          <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-600 mb-1">Questions</p>
              <p className="text-2xl font-bold text-gray-900">
                {quiz.questions.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Passing Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {quiz.passingScore}%
              </p>
            </div>
            {quiz.timeLimit && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Time Limit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quiz.timeLimit} min
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {quiz.questions.reduce(
                  (sum: number, q: any) => sum + q.points,
                  0
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending}
            className="w-full btn-primary py-4 text-lg flex items-center justify-center"
          >
            {startMutation.isPending ? "Starting..." : "Start Quiz"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // Quiz taking interface
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <p className="text-sm text-gray-600">{question.points} points</p>
          </div>
          {timeLeft !== null && (
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                timeLeft < 60
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium">{formatDuration(timeLeft)}</span>
            </div>
          )}
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h3 className="text-xl font-medium text-gray-900 mb-6">
          {question.text}
        </h3>

        {/* Answer options */}
        <div className="space-y-3">
          {question.type === "multiple-choice" &&
            question.options?.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[question._id!] === option
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[question._id!] === option
                        ? "border-primary-500 bg-primary-500"
                        : "border-gray-300"
                    }`}
                  >
                    {answers[question._id!] === option && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}

          {question.type === "true-false" && (
            <>
              {["True", "False"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[question._id!] === option
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    {option === "True" ? (
                      <CheckCircle2
                        className={`w-6 h-6 mr-3 ${
                          answers[question._id!] === option
                            ? "text-primary-500"
                            : "text-gray-400"
                        }`}
                      />
                    ) : (
                      <XCircle
                        className={`w-6 h-6 mr-3 ${
                          answers[question._id!] === option
                            ? "text-primary-500"
                            : "text-gray-400"
                        }`}
                      />
                    )}
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {question.type === "short-answer" && (
            <textarea
              value={answers[question._id!] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
              rows={4}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </button>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="btn-primary flex items-center"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Quiz"}
            <Trophy className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-primary flex items-center"
          >
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}
