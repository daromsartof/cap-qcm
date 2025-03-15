import { BASE_URL } from "@/constants/Url"
import axios from "axios"
import { getToken } from "./auth.service"

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor (Optional)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g. logout if token expires)
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized
      console.log("Token expired or invalid")
    }
    return Promise.reject(error)
  }
)

export default axiosClient
