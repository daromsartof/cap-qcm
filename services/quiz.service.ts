import { API_URL } from "@/constants/Url"
import axiosClient from "./axio.service"
import { Quiz } from "@/types/Quiz"

const getAllQuiz = async ({
    categorieId
} : {
    categorieId: number,
}): Promise<Array<Quiz>> => {
    try {
        const { data } = await axiosClient.get(API_URL.QUIZ, {
          params: {
            categorieId,
          },
        })

        return data
    } catch (error) {
        return []
    }
}

export { getAllQuiz }