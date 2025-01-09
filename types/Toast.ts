export type ToastType = "success" | "error" | "info" | "custom"

export interface ToastProps {
  type: ToastType
  text1: string
  text2?: string
  position?: "top" | "bottom"
  visibilityTime?: number
  autoHide?: boolean
  topOffset?: number
  bottomOffset?: number
  onShow?: () => void
  onHide?: () => void
  onPress?: () => void
}

export interface ToastContextType {
  showToast: (
    type: ToastType,
    text1: string,
    text2?: string,
    options?: Partial<ToastProps>
  ) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}
