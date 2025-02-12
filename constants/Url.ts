const BASE_URL = "http://192.168.1.169:3000/api"

const API_URL = {
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  FORGOT_PASSWORD: `${BASE_URL}/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/reset-password`,
  CATEGORIE: `${BASE_URL}/categorie`,
  USERS: `${BASE_URL}/users`,
  QUIZ: `${BASE_URL}/quiz`,
  TRAIN: `${BASE_URL}/train`,
  QUIZ_TRAIN: `${BASE_URL}/quiz-train`,
  QUIZ_TRAIN_RESULT: `${BASE_URL}/quiz-train-result`
}
const DEFAULT_PASSWORD = "123"
export { BASE_URL, API_URL, DEFAULT_PASSWORD }