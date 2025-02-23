type Answer = {
  id: number
  text: string
}

type Question = {
  id: number
  text: string
  answers: Answer[]
}

type QuizCategory = {
  id: number
  name: string
  image: string | null
  questions: Question[]
}

export default QuizCategory
