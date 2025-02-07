import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Slot } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import "react-native-reanimated"
import Toast from "react-native-toast-message"
import { useColorScheme } from "@/hooks/useColorScheme"
import { AuthProvider } from "@/contexts/AutContext"
import { ToastProvider } from "@/contexts/ToastContext"
import { toastConfig } from "@/config/toast"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            children={undefined}
          >
            <Slot />
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
      <Toast config={toastConfig} />
    </>
  )
}
