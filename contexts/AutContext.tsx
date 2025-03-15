import { createContext, useContext, useEffect, useState } from "react"
import * as SecureStore from "expo-secure-store"

import { router } from "expo-router"
import { sendVerificationEmail, verifyEmail } from "@/services/auth.service"

const AuthContext = createContext({
  user: null,
  login: async (email: string) => {},
  verifyCode: async (
    code: string,
    saveToken: Boolean,
    localEmail: string
  ) => {},
  email: "",
  logout: async () => {},
  loading: false,
})

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const login = async (email: string) => {
    try {
      const response = await sendVerificationEmail({
        email,
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

  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken")
    setUser(null)
    router.push("/(auth)/login")
  }
  const verifyCode = async (
    code: string,
    saveToken: Boolean,
    localEmail: string
  ) => {
    try {
      const result = await verifyEmail({
        email: email || localEmail,
        code,
      })
      if (result) {
        if (saveToken) {
          await SecureStore.setItemAsync("userToken", result.token)
        }
        await SecureStore.setItemAsync("userInfo", JSON.stringify(result))
        setUser(result)
        router.push("/(home)")
      }
    } catch (error) {
      throw error
    }
  }

  const handleGetUserInfo = async () => {
    try {
      const userInfo = await SecureStore.getItemAsync("userInfo")
      if (userInfo) {
        setUser(JSON.parse(userInfo))
      }
    } catch (error) {
      throw error
    }
  }
  console.log(user)

  useEffect(() => {
    handleGetUserInfo()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, logout, login, email, loading, verifyCode }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
