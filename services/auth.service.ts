import * as SecureStore from "expo-secure-store"
import axiosClient from "./axio.service"
import { API_URL } from "@/constants/Url"
import { User } from "@/types/User"

const register = async ({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}): Promise<User> => {
  try {
    const { data } = await axiosClient.post(API_URL.REGISTER, {
      name,
      email,
      password,
    })

    return {
      id: data.user.id,
      pseudo: data.user.name,
      email: data.user.email,
      roles: [data.user.roles]
    }
  } catch (error: any) {
    throw error
  }
}

const storeToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("userToken", token)
  } catch (error) {
    console.error("Error storing token:", error)
  }
}

const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("userToken")
    if (token) {
      return token
    } else {
      return null
    }
  } catch (error) {
    console.error("Error retrieving token:", error)
    return null
  }
}

const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync("userToken")
  } catch (error) {
    console.error("Error deleting token:", error)
  }
}
export { register, getToken, storeToken }
