import React, { useEffect } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { FontAwesome5 } from "@expo/vector-icons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
  FadeIn,
  FadeInDown,
  ZoomIn,
} from "react-native-reanimated"
import FullBgContainer from "@/components/FullBgContainer"
import { ThemedText as Text } from "@/components/ThemedText"
import LottieView from "lottie-react-native"

const { width, height } = Dimensions.get("window")

const AccountCreatedScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { pseudo, email } = params

  // Animation values
  const successScale = useSharedValue(0)
  const buttonScale = useSharedValue(1)
  const cardTranslateY = useSharedValue(50)
  const cardOpacity = useSharedValue(0)

  useEffect(() => {
    // Animate success icon
    successScale.value = withSequence(
      withDelay(500, withSpring(1.2, { damping: 12 })),
      withTiming(1, { duration: 300 })
    )

    // Animate card
    cardTranslateY.value = withDelay(
      1000,
      withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.back()),
      })
    )

    cardOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }))

    // Auto redirect after some time
    const timer = setTimeout(() => {
      handleContinue()
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  const handleContinue = () => {
    router.replace("/(auth)/login")
  }

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 })
  }

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 })
  }

  const successAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }))

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
    opacity: cardOpacity.value,
  }))

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  return (
    <FullBgContainer>
      <View style={styles.container}>
        <Animated.View
          style={styles.headerContainer}
          entering={FadeInDown.delay(200).duration(800)}
        >
          <Text style={styles.title}>Compte créé !</Text>
          <Text style={styles.subtitle}>
            Votre compte a été créé avec succès
          </Text>
        </Animated.View>

        <View style={styles.successContainer}>
          <Animated.View style={[styles.successCircle, successAnimStyle]}>
            {/* You can use a Lottie animation here for a more dynamic effect */}
            <LottieView
              source={require("@/assets/animations/success-animation.json")}
              autoPlay
              loop={false}
              style={styles.lottieAnimation}
            />
            {/* Fallback if Lottie is not available */}
            {/* <FontAwesome5 name="check" size={60} color="#FFFFFF" /> */}
          </Animated.View>
        </View>

        <Animated.View style={[styles.cardContainer, cardAnimStyle]}>
          <View style={styles.card}>
            <Image
              source={require("@/assets/images/account-success-illustration.png")}
              style={styles.illustration}
              resizeMode="contain"
            />

            <Text style={styles.welcomeText}>
              Bienvenue,{" "}
              <Text style={styles.highlightText}>
                {pseudo || "Utilisateur"}
              </Text>{" "}
              !
            </Text>

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <FontAwesome5 name="envelope" size={16} color="#5D4037" />
                <Text style={styles.infoText}>
                  {email || "email@example.com"}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <FontAwesome5 name="info-circle" size={16} color="#5D4037" />
                <Text style={styles.infoText}>
                  Votre compte est prêt à être utilisé
                </Text>
              </View>
            </View>

            <Text style={styles.instructionText}>
              Vous allez être redirigé vers la page de connexion dans quelques
              instants...
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[styles.buttonContainer, buttonAnimStyle]}
          entering={FadeIn.delay(2000).duration(800)}
        >
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.continueButtonText}>Continuer</Text>
            <FontAwesome5
              name="arrow-right"
              size={16}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </FullBgContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
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
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  cardContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  illustration: {
    width: width * 0.5,
    height: height * 0.15,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5D4037",
    marginBottom: 15,
    textAlign: "center",
  },
  highlightText: {
    color: "#FFD700",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  infoContainer: {
    width: "100%",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    backgroundColor: "rgba(93, 64, 55, 0.1)",
    padding: 12,
    borderRadius: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#5D4037",
    flex: 1,
  },
  instructionText: {
    fontSize: 14,
    color: "rgba(93, 64, 55, 0.7)",
    textAlign: "center",
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: "#5D4037",
    borderRadius: 10,
    height: 55,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginLeft: 10,
  },
})

export default AccountCreatedScreen
