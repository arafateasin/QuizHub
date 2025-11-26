import mongoose, { Schema, Document } from "mongoose";

export interface IAnswer {
  questionId: string;
  userAnswer: string | number;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface IAttempt extends Document {
  quizId: mongoose.Types.ObjectId;
  userId: string;
  answers: IAnswer[];
  score: number;
  percentage: number;
  isPassed: boolean;
  xpEarned: number;
  startedAt: Date;
  completedAt?: Date;
  status: "IN_PROGRESS" | "COMPLETED";
}

const AnswerSchema = new Schema({
  questionId: { type: String, required: true },
  userAnswer: { type: Schema.Types.Mixed, required: true },
  isCorrect: { type: Boolean, required: true },
  pointsEarned: { type: Number, required: true },
});

const AttemptSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true, index: true },
    userId: { type: String, required: true, index: true },
    answers: [AnswerSchema],
    score: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    isPassed: { type: Boolean, default: false },
    xpEarned: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED"],
      default: "IN_PROGRESS",
    },
  },
  {
    timestamps: true,
  }
);

export const Attempt = mongoose.model<IAttempt>("Attempt", AttemptSchema);
