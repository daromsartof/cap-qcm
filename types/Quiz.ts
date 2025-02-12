import { Categorie } from "./Categorie";
import { QuizMatieres } from "./QuizMatieres";
import { QuizQuestion } from "./QuizQuestion";

export type Quiz = {
    id: number;
    title: string;
    description: string;
    level: number;
    time: number;
    categorieId: number;
    createdAt: string;
    category: Categorie,
    mode: number;
    quizQuestions: Array<QuizQuestion>;
    quizMatieres: Array<QuizMatieres>;
}