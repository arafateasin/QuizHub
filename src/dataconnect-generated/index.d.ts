import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AnswerOption_Key {
  id: UUIDString;
  __typename?: 'AnswerOption_Key';
}

export interface CreateQuizData {
  quiz_insert: Quiz_Key;
}

export interface GetMyQuizAttemptsData {
  quizAttempts: ({
    id: UUIDString;
    quiz?: {
      title: string;
    };
      score: number;
      completedAt: TimestampString;
  } & QuizAttempt_Key)[];
}

export interface GetPublicQuizzesData {
  quizzes: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    category: string;
  } & Quiz_Key)[];
}

export interface Question_Key {
  id: UUIDString;
  __typename?: 'Question_Key';
}

export interface QuizAttempt_Key {
  id: UUIDString;
  __typename?: 'QuizAttempt_Key';
}

export interface Quiz_Key {
  id: UUIDString;
  __typename?: 'Quiz_Key';
}

export interface SubmitQuizAttemptData {
  quizAttempt_insert: QuizAttempt_Key;
}

export interface SubmitQuizAttemptVariables {
  quizId: UUIDString;
  score: number;
  durationSeconds?: number | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateQuizData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateQuizData, undefined>;
  operationName: string;
}
export const createQuizRef: CreateQuizRef;

export function createQuiz(): MutationPromise<CreateQuizData, undefined>;
export function createQuiz(dc: DataConnect): MutationPromise<CreateQuizData, undefined>;

interface GetPublicQuizzesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPublicQuizzesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPublicQuizzesData, undefined>;
  operationName: string;
}
export const getPublicQuizzesRef: GetPublicQuizzesRef;

export function getPublicQuizzes(): QueryPromise<GetPublicQuizzesData, undefined>;
export function getPublicQuizzes(dc: DataConnect): QueryPromise<GetPublicQuizzesData, undefined>;

interface SubmitQuizAttemptRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SubmitQuizAttemptVariables): MutationRef<SubmitQuizAttemptData, SubmitQuizAttemptVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SubmitQuizAttemptVariables): MutationRef<SubmitQuizAttemptData, SubmitQuizAttemptVariables>;
  operationName: string;
}
export const submitQuizAttemptRef: SubmitQuizAttemptRef;

export function submitQuizAttempt(vars: SubmitQuizAttemptVariables): MutationPromise<SubmitQuizAttemptData, SubmitQuizAttemptVariables>;
export function submitQuizAttempt(dc: DataConnect, vars: SubmitQuizAttemptVariables): MutationPromise<SubmitQuizAttemptData, SubmitQuizAttemptVariables>;

interface GetMyQuizAttemptsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyQuizAttemptsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyQuizAttemptsData, undefined>;
  operationName: string;
}
export const getMyQuizAttemptsRef: GetMyQuizAttemptsRef;

export function getMyQuizAttempts(): QueryPromise<GetMyQuizAttemptsData, undefined>;
export function getMyQuizAttempts(dc: DataConnect): QueryPromise<GetMyQuizAttemptsData, undefined>;

