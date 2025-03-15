import React, { useState } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Switch,
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
  Easing,
} from "react-native-reanimated"
import FullBgContainer from "@/components/FullBgContainer"
import { ThemedText as Text } from "@/components/ThemedText"

const { width, height } = Dimensions.get("window")

const ConsentScreen = () => {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [marketingAccepted, setMarketingAccepted] = useState(false)
  const [error, setError] = useState("")

  const buttonScale = useSharedValue(1)
  const errorTranslateX = useSharedValue(0)
  const checkboxScale1 = useSharedValue(1)
  const checkboxScale2 = useSharedValue(1)
  const checkboxScale3 = useSharedValue(1)

  const router = useRouter()

  const handleContinue = () => {
    if (!termsAccepted || !privacyAccepted) {
      setError(
        "Vous devez accepter les conditions d'utilisation et la politique de confidentialité pour continuer"
      )
      shakeError()
      return
    }

    router.push("/(auth)/singup")
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

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 })
  }

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 })
  }

  const animateCheckbox = (checkbox: Animated.SharedValue<number>) => {
    checkbox.value = withSequence(
      withTiming(1.2, {
        duration: 150,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      }),
      withTiming(1, {
        duration: 150,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      })
    )
  }

  const handleToggleTerms = () => {
    setTermsAccepted(!termsAccepted)
    animateCheckbox(checkboxScale1)
    if (error) setError("")
  }

  const handleTogglePrivacy = () => {
    setPrivacyAccepted(!privacyAccepted)
    animateCheckbox(checkboxScale2)
    if (error) setError("")
  }

  const handleToggleMarketing = () => {
    setMarketingAccepted(!marketingAccepted)
    animateCheckbox(checkboxScale3)
  }

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const errorAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: errorTranslateX.value }],
  }))

  const checkboxAnimStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: checkboxScale1.value }],
  }))

  const checkboxAnimStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: checkboxScale2.value }],
  }))

  const checkboxAnimStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: checkboxScale3.value }],
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
            <Text style={styles.title}>Conditions d'utilisation</Text>
            <Text style={styles.subtitle}>
              Avant de commencer, veuillez lire et accepter nos conditions
            </Text>
          </Animated.View>

          <Animated.View
            style={styles.illustrationContainer}
            entering={FadeInDown.delay(400).duration(800)}
          >
            <Image
              source={require("@/assets/images/consent-illustration.png")}
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

            <View style={styles.consentSection}>
              <Animated.View
                style={[styles.checkboxContainer, checkboxAnimStyle1]}
              >
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={handleToggleTerms}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkboxInner,
                      termsAccepted && styles.checkboxInnerActive,
                    ]}
                  >
                    {termsAccepted && (
                      <FontAwesome5 name="check" size={12} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
                <View style={styles.checkboxTextContainer}>
                  <Text style={styles.checkboxLabel}>
                    J'accepte les{" "}
                    <Text style={styles.linkText}>
                      conditions d'utilisation
                    </Text>
                  </Text>
                  <Text style={styles.checkboxDescription}>
                    Vous devez accepter nos conditions d'utilisation pour
                    utiliser l'application
                  </Text>
                </View>
              </Animated.View>

              <Animated.View
                style={[styles.checkboxContainer, checkboxAnimStyle2]}
              >
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={handleTogglePrivacy}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkboxInner,
                      privacyAccepted && styles.checkboxInnerActive,
                    ]}
                  >
                    {privacyAccepted && (
                      <FontAwesome5 name="check" size={12} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
                <View style={styles.checkboxTextContainer}>
                  <Text style={styles.checkboxLabel}>
                    J'accepte la{" "}
                    <Text style={styles.linkText}>
                      politique de confidentialité
                    </Text>
                  </Text>
                  <Text style={styles.checkboxDescription}>
                    Vous devez accepter notre politique de confidentialité pour
                    utiliser l'application
                  </Text>
                </View>
              </Animated.View>

              <Animated.View
                style={[styles.checkboxContainer, checkboxAnimStyle3]}
              >
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={handleToggleMarketing}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkboxInner,
                      marketingAccepted && styles.checkboxInnerActive,
                    ]}
                  >
                    {marketingAccepted && (
                      <FontAwesome5 name="check" size={12} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
                <View style={styles.checkboxTextContainer}>
                  <Text style={styles.checkboxLabel}>
                    J'accepte de recevoir des communications marketing
                  </Text>
                  <Text style={styles.checkboxDescription}>
                    Nous vous enverrons des informations sur nos nouveaux
                    produits et offres (optionnel)
                  </Text>
                </View>
              </Animated.View>
            </View>

            <Animated.View style={buttonAnimStyle}>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  (!termsAccepted || !privacyAccepted) &&
                    styles.continueButtonDisabled,
                ]}
                onPress={handleContinue}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <Text style={styles.continueButtonText}>Continuer</Text>
              </TouchableOpacity>
            </Animated.View>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 8,
    textAlign: "center",
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  illustration: {
    width: width * 0.7,
    height: height * 0.2,
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
    flex: 1,
  },
  consentSection: {
    marginBottom: 25,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxInner: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInnerActive: {
    backgroundColor: "#FFD700",
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  linkText: {
    color: "#FFD700",
    textDecorationLine: "underline",
  },
  continueButton: {
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
  continueButtonDisabled: {
    backgroundColor: "rgba(93, 64, 55, 0.5)",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  loginText: {
    color: "#FFD700",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
})

export default ConsentScreen
