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
  questions: Question[]
}

export default QuizCategory
