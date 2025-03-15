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
import { register } from "@/services/auth.service"

const { width, height } = Dimensions.get("window")

const SignupScreen = () => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const emailBorderColor = useSharedValue("rgba(255, 255, 255, 0.3)")
  const usernameBorderColor = useSharedValue("rgba(255, 255, 255, 0.3)")
  const passwordBorderColor = useSharedValue("rgba(255, 255, 255, 0.3)")
  const confirmPasswordBorderColor = useSharedValue("rgba(255, 255, 255, 0.3)")
  const buttonScale = useSharedValue(1)
  const errorTranslateX = useSharedValue(0)

  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSignup = async () => {
    // Reset error
    setError("")

    // Validate inputs
    if (!email || !username) {
      setError("Veuillez remplir tous les champs")
      shakeError()
      return
    }

    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse email valide")
      shakeError()
      return
    }

    {
      /* if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      shakeError()
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      shakeError()
      return
    }*/
    }

    setIsLoading(true)

    try {
      const user = await register({
        email,
        name: username,
        password: "1234",
      })
      console.log(user)
      if (user) {
        router.push({
          pathname: "/(auth)/accountcreated",
          params: { pseudo: username, email },
        })
      }
    } catch (err) {
      console.log(err)

      setError("Une erreur est survenue lors de l'inscription")
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

  const handleFocus = (field: string) => {
    switch (field) {
      case "email":
        emailBorderColor.value = withTiming("#FFD700", { duration: 300 })
        break
      case "username":
        usernameBorderColor.value = withTiming("#FFD700", { duration: 300 })
        break
      case "password":
        passwordBorderColor.value = withTiming("#FFD700", { duration: 300 })
        break
      case "confirmPassword":
        confirmPasswordBorderColor.value = withTiming("#FFD700", {
          duration: 300,
        })
        break
    }
  }

  const handleBlur = (field: string) => {
    switch (field) {
      case "email":
        emailBorderColor.value = withTiming("rgba(255, 255, 255, 0.3)", {
          duration: 300,
        })
        break
      case "username":
        usernameBorderColor.value = withTiming("rgba(255, 255, 255, 0.3)", {
          duration: 300,
        })
        break
      case "password":
        passwordBorderColor.value = withTiming("rgba(255, 255, 255, 0.3)", {
          duration: 300,
        })
        break
      case "confirmPassword":
        confirmPasswordBorderColor.value = withTiming(
          "rgba(255, 255, 255, 0.3)",
          { duration: 300 }
        )
        break
    }
  }

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 })
  }

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 })
  }

  const emailInputStyle = useAnimatedStyle(() => ({
    borderColor: emailBorderColor.value,
  }))

  const usernameInputStyle = useAnimatedStyle(() => ({
    borderColor: usernameBorderColor.value,
  }))

  const passwordInputStyle = useAnimatedStyle(() => ({
    borderColor: passwordBorderColor.value,
  }))

  const confirmPasswordInputStyle = useAnimatedStyle(() => ({
    borderColor: confirmPasswordBorderColor.value,
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
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>
              Rejoignez-nous pour accéder à tous nos services
            </Text>
          </Animated.View>

          <Animated.View
            style={styles.illustrationContainer}
            entering={FadeInDown.delay(400).duration(800)}
          >
            <Image
              source={require("@/assets/images/signup-illustration.png")}
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

            <Animated.View style={[styles.inputContainer, usernameInputStyle]}>
              <FontAwesome5
                name="user"
                size={18}
                color="rgba(255, 255, 255, 0.7)"
              />
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                onFocus={() => handleFocus("username")}
                onBlur={() => handleBlur("username")}
                selectionColor="#FFD700"
              />
            </Animated.View>

            {/*  <Animated.View style={[styles.inputContainer, passwordInputStyle]}>
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
            </Animated.View>

           {/* <Animated.View
              style={[styles.inputContainer, confirmPasswordInputStyle]}
            >
              <FontAwesome5
                name="lock"
                size={18}
                color="rgba(255, 255, 255, 0.7)"
              />
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                onFocus={() => handleFocus("confirmPassword")}
                onBlur={() => handleBlur("confirmPassword")}
                selectionColor="#FFD700"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <FontAwesome5
                  name={showConfirmPassword ? "eye-slash" : "eye"}
                  size={18}
                  color="rgba(255, 255, 255, 0.7)"
                />
              </TouchableOpacity>
            </Animated.View>*/}

            <Animated.View style={buttonAnimStyle}>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signupButtonText}>S'inscrire</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.privacyTextContainer}>
              <Text style={styles.privacyText}>
                En vous inscrivant, vous acceptez nos{" "}
                <Text style={styles.linkText}>conditions d'utilisation</Text> et
                notre{" "}
                <Text style={styles.linkText}>
                  politique de confidentialité
                </Text>
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            style={styles.footer}
            entering={FadeInUp.delay(800).duration(800)}
          >
            <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginText}>Se connecter</Text>
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
    marginBottom: 15,
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
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  illustration: {
    width: width * 0.6,
    height: height * 0.18,
  },
  formContainer: {
    width: "100%",
    marginBottom: 15,
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
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
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
  signupButton: {
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
    marginTop: 5,
  },
  signupButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  privacyTextContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  privacyText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 18,
  },
  linkText: {
    color: "#FFD700",
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  loginText: {
    color: "#FFD700",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
})

export default SignupScreen
