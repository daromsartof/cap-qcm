import { Redirect, router } from "expo-router"
import { useEffect, useState } from "react"
import * as SecureStore from "expo-secure-store"

export default function AuthLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("authToken")
      console.log("here is token", token)
      
      setIsAuthenticated(!!token)
    }

    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return null // Ou un écran de chargement
  }
 return <Redirect href="/(home)" />
  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />
  }

 
}
