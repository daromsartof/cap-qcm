import React, { useState, useEffect, useRef } from "react"
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Keyboard,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { FontAwesome5 } from "@expo/vector-icons"
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated"
import FullBgContainer from "@/components/FullBgContainer"
import { ThemedText as Text } from "@/components/ThemedText"
import { useAuth } from "@/contexts/AutContext"
import { sendVerificationEmail } from "@/services/auth.service"

const { width, height } = Dimensions.get("window")

// Number of code input fields
const CODE_LENGTH = 6

const SecondAuthScreen = () => {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const inputRefs = useRef([])
  const { verifyCode, email } = useAuth()

  const router = useRouter()

  // Animation values
  const buttonScale = useSharedValue(1)
  const errorTranslateX = useSharedValue(0)
  const codeContainerScale = useSharedValue(1)
  const timerOpacity = useSharedValue(1)

  // Timer for code expiration
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timerId)
    } else {
      setCanResend(true)
      timerOpacity.value = withTiming(0.5, { duration: 300 })
    }
  }, [timeLeft])

  // Focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
    }, 500)
  }, [])

  const handleCodeChange = (text: string, index: number) => {
    // Update the code array
    const newCode = [...code]
    newCode[index] = text
    setCode(newCode)

    // Clear error if any
    if (error) setError("")

    // Auto-advance to next input
    if (text.length === 1 && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1].focus()
    }

    // Check if code is complete
    if (index === CODE_LENGTH - 1 && text.length === 1) {
      Keyboard.dismiss()
      // Small delay to allow animation before verification
      setTimeout(() => {
        handleVerifyCode(newCode)
      }, 300)
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to go to previous input
    if (e.nativeEvent.key === "Backspace" && index > 0 && !code[index]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleVerifyCode = async (newCode: string[] | undefined) => {
    setIsLoading(true)

    try {
      const fullCode = newCode ? newCode.join("") : code.join("")
      await verifyCode(String(fullCode), true, email)
    } catch (err) {
      console.log(err)
      setError("Code invalide. Veuillez réessayer.")
      shakeError()
      pulseCodeContainer()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!canResend) return

    setIsLoading(true)

    try {
      await sendVerificationEmail({ email })
      setTimeLeft(60)
      setCanResend(false)
      timerOpacity.value = withTiming(1, { duration: 300 })
      setCode(Array(CODE_LENGTH).fill(""))

      // Focus first input after resend
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus()
        }
      }, 500)
    } catch (err) {
      setError("Erreur lors de l'envoi du code. Veuillez réessayer.")
      shakeError()
    } finally {
      setIsLoading(false)
    }
  }

  const shakeError = () => {
    errorTranslateX.value = withSequence(
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    )
  }

  const pulseCodeContainer = () => {
    codeContainerScale.value = withSequence(
      withTiming(1.05, { duration: 100 }),
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    )
  }

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 })
  }

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 })
  }

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const errorAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: errorTranslateX.value }],
  }))

  const codeContainerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: codeContainerScale.value }],
  }))

  const timerAnimStyle = useAnimatedStyle(() => ({
    opacity: timerOpacity.value,
  }))

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <FullBgContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Animated.View
            style={styles.headerContainer}
            entering={FadeInDown.delay(200).duration(800)}
          >
            <Text style={styles.title}>Vérification</Text>
            <Text style={styles.subtitle}>
              Entrez le code de sécurité envoyé à
            </Text>
            <Text style={styles.emailText}>{email}</Text>
          </Animated.View>

          <Animated.View
            style={styles.illustrationContainer}
            entering={FadeInDown.delay(400).duration(800)}
          >
            <Image
              source={require("@/assets/images/verification-illustration.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View
            style={styles.formContainer}
            entering={FadeInUp.delay(600).duration(800)}
          >
            {error ? (
              <Animated.View style={[styles.errorContainer, errorAnimStyle]}>
                <FontAwesome5
                  name="exclamation-circle"
                  size={16}
                  color="#FF6B6B"
                />
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            ) : null}

            <Animated.View
              style={[styles.codeContainer, codeContainerAnimStyle]}
            >
              {Array(CODE_LENGTH)
                .fill(0)
                .map((_, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.codeInput}
                    value={code[index]}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectionColor="#FFD700"
                    autoCapitalize="none"
                  />
                ))}
            </Animated.View>

            <Animated.View style={[styles.timerContainer, timerAnimStyle]}>
              <FontAwesome5
                name="clock"
                size={16}
                color="rgba(255, 255, 255, 0.7)"
              />
              <Text style={styles.timerText}>
                {canResend
                  ? "Code expiré"
                  : `Expire dans ${formatTime(timeLeft)}`}
              </Text>
            </Animated.View>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendCode}
              disabled={!canResend || isLoading}
            >
              <Text
                style={[
                  styles.resendText,
                  !canResend && styles.resendTextDisabled,
                ]}
              >
                Renvoyer le code
              </Text>
            </TouchableOpacity>

            <Animated.View style={buttonAnimStyle}>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleVerifyCode}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.verifyButtonText}>Vérifier</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          <Animated.View
            style={styles.footer}
            entering={FadeInUp.delay(800).duration(800)}
          >
            <Text style={styles.footerText}>
              Vous n'avez pas reçu de code ? Vérifiez vos spams ou
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.changeEmailText}>
                changez d'adresse email
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </FullBgContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 8,
  },
  emailText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginTop: 5,
  },
  illustrationContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  illustration: {
    width: width * 0.6,
    height: height * 0.18,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
  },
  errorText: {
    color: "#FF6B6B",
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  codeInput: {
    width: width / 8,
    height: 60,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  timerText: {
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 8,
    fontSize: 14,
  },
  resendButton: {
    marginBottom: 20,
    padding: 10,
  },
  resendText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600",
  },
  resendTextDisabled: {
    color: "rgba(255, 215, 0, 0.5)",
  },
  verifyButton: {
    backgroundColor: "#5D4037",
    borderRadius: 10,
    height: 55,
    width: width - 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginBottom: 30,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  changeEmailText: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default SecondAuthScreen
