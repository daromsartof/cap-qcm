import { API_URL } from "@/constants/Url"
import axiosClient from "./axio.service"

const getQuizResult = async ({
  quizId,
  userId,
  data,
}: {
  quizId: number
  userId: number
  data: Array<{
    questionId: number
    answerId: number
  }>
}): Promise<
  | {
      scorePercentage: number
      correctAnswers: number
      totalQuestions: number
      categorie: number
      questions: Array<{
        isCorrect: boolean
        text: string
        answerImage: string | null
        userAnswer: string | null
        hasImage: boolean
        correctAnswer: string
        image: string | null
      }>
    }
  | Object
> => {
  console.log(
    "hi ",
    JSON.stringify({
      quizId,
      userId,
      data,
    })
  )
  try {
    const { data: reponse } = await axiosClient.post(API_URL.USER_QUIZ, {
      quizId,
      userId,
      data,
    })
    console.log("reponse ", reponse)
    return reponse
  } catch (error) {
    console.log("error here ", error)

    return {}
  }
}

export { getQuizResult }
