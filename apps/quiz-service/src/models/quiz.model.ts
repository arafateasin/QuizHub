import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

export interface IQuiz extends Document {
  title: string;
  description: string;
  category: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  questions: IQuestion[];
  createdBy: string;
  isPublic: boolean;
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  totalAttempts: number;
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema({
  type: {
    type: String,
    enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"],
    required: true,
  },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Schema.Types.Mixed, required: true },
  explanation: { type: String },
  points: { type: Number, required: true, default: 10 },
});

const QuizSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      required: true,
      index: true,
    },
    questions: [QuestionSchema],
    createdBy: { type: String, required: true, index: true },
    isPublic: { type: Boolean, default: true },
    timeLimit: { type: Number },
    passingScore: { type: Number, default: 60 },
    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Add text index for search
QuizSchema.index({ title: "text", description: "text" });

export const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);
