const BASE_URL = "http://192.168.1.169:3000/api"

const API_URL = {
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  FORGOT_PASSWORD: `${BASE_URL}/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/reset-password`,
  CATEGORIE: `${BASE_URL}/categorie`
}
const DEFAULT_PASSWORD = "123"
export { BASE_URL, API_URL, DEFAULT_PASSWORD }