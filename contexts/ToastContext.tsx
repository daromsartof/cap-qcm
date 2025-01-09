import { ToastContextType, ToastProps, ToastType } from "@/types/Toast"
import React, { createContext, useContext } from "react"
import Toast from "react-native-toast-message"

const ToastContext = createContext<ToastContextType>({} as ToastContextType)

interface ToastProviderProps {
  children: React.ReactNode
}
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const showToast = (
    type: ToastType,
    text1: string,
    text2: string = "",
    options: Partial<ToastProps> = {}
  ) => {
    Toast.show({
      type,
      text1,
      text2,
      position: "bottom",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
      ...options,
    })
  }

  const success = (title: string, message?: string) =>
    showToast("success", title, message)

  const error = (title: string, message?: string) =>
    showToast("error", title, message)

  const info = (title: string, message?: string) =>
    showToast("info", title, message)

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
    </ToastContext.Provider>
  )
}

export default ToastContext
