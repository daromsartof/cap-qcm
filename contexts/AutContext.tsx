import { createContext, useContext, useState } from "react"
import * as SecureStore from "expo-secure-store"

import { router } from "expo-router"
import { sendVerificationEmail, verifyEmail } from "@/services/auth.service"

const AuthContext = createContext({
  user: null,
  login: async (email: string) => {},
  verifyCode: async (code: string, saveToken: Boolean) => {},
  email: "",
  loading: false
})

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const login = async (email: string) => {
    try {
      const response = await sendVerificationEmail({
        email
      })
      console.log(response)

      if (response) {
        setEmail(email)
        router.push("/(auth)/(singin)/secondauth")
      }
    } catch (error) {
      throw error
    }
  }

  const verifyCode = async (code: string, saveToken: Boolean) => {
    try {
      const result = await verifyEmail({
        email,
        code
      })
      if (result) {
        if (saveToken) {
          await SecureStore.setItemAsync("userToken", result.token)
        }
        setUser(result)
        router.push("/(home)")
      }
    } catch (error) {
      throw error
    }
  }  

  return (
    <AuthContext.Provider value={{ user, login, email, loading, verifyCode }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
