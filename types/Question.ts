import { Answer } from "./Answer"

export type Question = {
  id: number
  title: string
  description: string | null
  createdAt: string
  updatedAt: string | null
  isDeleted: boolean
  isMultiChoice: boolean
  categoryId: number
  matiereId: number
  fileUrl: string | null
  sourceId: number
  answers: Answer[]
}