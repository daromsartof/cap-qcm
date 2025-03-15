import React, { useState } from "react"
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import { Link, useRouter } from "expo-router"
import { FontAwesome5 } from "@expo/vector-icons"
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import FullBgContainer from "@/components/FullBgContainer"
import { ThemedText as Text } from "@/components/ThemedText"
import { useAuth } from "@/contexts/AutContext"

const { width, height } = Dimensions.get("window")

const LoginScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const emailBorderColor = useSharedValue("rgba(255, 255, 255, 0.3)")
  const passwordBorderColor = useSharedValue("rgba(255, 255, 255, 0.3)")
  const buttonScale = useSharedValue(1)

  const router = useRouter()

  const handleLogin = async () => {
    if (!email) {
      setError("Veuillez remplir tous les champs")
      shakeError()
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await login(email)
    } catch (err) {
      setError("Identifiants incorrects")
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

  const handleFocus = (field) => {
    if (field === "email") {
      emailBorderColor.value = withTiming("#FFD700", { duration: 300 })
    } else {
      passwordBorderColor.value = withTiming("#FFD700", { duration: 300 })
    }
  }

  const handleBlur = (field: any) => {
    if (field === "email") {
      emailBorderColor.value = withTiming("rgba(255, 255, 255, 0.3)", {
        duration: 300,
      })
    } else {
      passwordBorderColor.value = withTiming("rgba(255, 255, 255, 0.3)", {
        duration: 300,
      })
    }
  }

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 })
  }

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 })
  }

  const errorTranslateX = useSharedValue(0)

  const emailInputStyle = useAnimatedStyle(() => ({
    borderColor: emailBorderColor.value,
  }))

  const passwordInputStyle = useAnimatedStyle(() => ({
    borderColor: passwordBorderColor.value,
  }))

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const errorAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: errorTranslateX.value }],
  }))

  return (
    <FullBgContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={styles.headerContainer}
            entering={FadeInDown.delay(200).duration(800)}
          >
            <Text style={styles.title}>CAP QCM</Text>
            <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
          </Animated.View>

          <Animated.View
            style={styles.illustrationContainer}
            entering={FadeInDown.delay(400).duration(800)}
          >
            <Image
              source={require("@/assets/images/login-illustration.png")}
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

            <Animated.View style={[styles.inputContainer, emailInputStyle]}>
              <FontAwesome5
                name="envelope"
                size={18}
                color="rgba(255, 255, 255, 0.7)"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                selectionColor="#FFD700"
              />
            </Animated.View>

            {/* <Animated.View style={[styles.inputContainer, passwordInputStyle]}>
              <FontAwesome5
                name="lock"
                size={18}
                color="rgba(255, 255, 255, 0.7)"
              />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
                selectionColor="#FFD700"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <FontAwesome5
                  name={showPassword ? "eye-slash" : "eye"}
                  size={18}
                  color="rgba(255, 255, 255, 0.7)"
                />
              </TouchableOpacity>
            </Animated.View>*/}

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Email oublié ?</Text>
            </TouchableOpacity>

            <Animated.View style={buttonAnimStyle}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Se connecter</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/*<View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome5 name="google" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome5 name="facebook-f" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome5 name="apple" size={20} color="#fff" />
              </TouchableOpacity>
            </View>*/}
          </Animated.View>

          <Animated.View
            style={styles.footer}
            entering={FadeInUp.delay(800).duration(800)}
          >
            <Text style={styles.footerText}>Vous n'avez pas de compte ?</Text>
            <Link href="/(auth)/consent" asChild>
              <TouchableOpacity>
                <Text style={styles.signupText}>S'inscrire</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </FullBgContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
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
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  illustration: {
    width: width * 0.7,
    height: height * 0.25,
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  errorText: {
    color: "#FF6B6B",
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55,
  },
  input: {
    flex: 1,
    color: "white",
    marginLeft: 10,
    fontSize: 16,
    height: "100%",
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#5D4037",
    borderRadius: 10,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 15,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(93, 64, 55, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  signupText: {
    color: "#FFD700",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
})

export default LoginScreen
