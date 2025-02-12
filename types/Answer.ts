export type Answer = {
    id: number;
    questionId: number;
    title: string;
    answerFileUrl: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string | null;
    isDeleted: boolean;
    isCorrect: boolean;
}