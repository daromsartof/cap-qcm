import { Question } from "./Question";

export type QuizQuestion = {
    id: number;
    quizId: number;
    questionId: number;
    questionOrder: number;
    question: Question
}