import { Matiere } from "./Matiere";

export type QuizMatieres = {
  id: number
  quizId: number
  matiereId: number
  matiereOrder: number | null
  matiere: Matiere
}