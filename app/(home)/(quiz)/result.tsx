import { Colors } from "@/constants/Colors"
import { formatTime } from "@/services/utils.service"
import { MaterialIcons, Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { TouchableOpacity, Dimensions, SafeAreaView } from "react-native"
import { ScrollView, StyleSheet, View } from "react-native"
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
} from "react-native-reanimated"
import ConfettiCannon from "react-native-confetti-cannon"
import { Text } from "react-native-paper"
import LottieView from "lottie-react-native"

const { width, height } = Dimensions.get("window")

const ResultScreen = () => {
  const { results } = useLocalSearchParams<{ results: string }>()
  const resultData = results ? JSON.parse(results!) : null
  const [fireConfetti, setFireConfetti] = useState(false)
  const router = useRouter()
  const lottieRef = useRef<LottieView>(null)

  // Animation values
  const scoreScale = useSharedValue(0.5)
  const cardOpacity = useSharedValue(0)
  const cardTranslateY = useSharedValue(50)
  const detailsOpacity = useSharedValue(0)
  const buttonScale = useSharedValue(1)

  const isPassing = resultData.scorePercentage >= 70

  useEffect(() => {
    if (isPassing) {
      setFireConfetti(true)
    }

    // Start animations in sequence
    scoreScale.value = withDelay(
      500,
      withSpring(1, { damping: 12, stiffness: 100 })
    )

    cardOpacity.value = withDelay(
      800,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    )

    cardTranslateY.value = withDelay(
      800,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.back()) })
    )

    detailsOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }))

    if (lottieRef.current) {
      setTimeout(() => {
        lottieRef.current?.play()
      }, 300)
    }
  }, [])

  const handleButtonPress = (action: "home" | "detail" | "back") => {
    if (action === "home") {
      router.push("/")
    } else if (action === "detail") {
      router.push({
        pathname: "/(home)/(quiz)/result-detail",
        params: { results: JSON.stringify(resultData) },
      })
    } else if (action === "back") {
      router.push({
        pathname: "/(home)/(quiz)/train",
        params: { categorie: JSON.stringify(resultData.categorie) },
      })
    }
  }

  const handlePressIn = (value: Animated.SharedValue<number>) => {
    value.value = withTiming(0.95, { duration: 100 })
  }

  const handlePressOut = (value: Animated.SharedValue<number>) => {
    value.value = withTiming(1, { duration: 100 })
  }

  // Animated styles
  const scoreCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }))

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }))

  const detailsStyle = useAnimatedStyle(() => ({
    opacity: detailsOpacity.value,
  }))

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={
          isPassing
            ? ["#4F7942", "#2E8B57"] // Success gradient
            : [Colors.light.bgPrimary, Colors.light.bgPrimary] // Needs improvement gradient
        }
        style={styles.resultContainer}
      >
        {fireConfetti && (
          <ConfettiCannon
            count={200}
            origin={{ x: width / 2, y: -10 }}
            explosionSpeed={350}
            fallSpeed={2500}
            colors={[
              Colors.light.primary,
              Colors.light.success,
              Colors.light.purple,
              Colors.light.orange,
              "#FFFFFF",
            ]}
            fadeOut
            autoStart
          />
        )}

        <View style={styles.header}>
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text style={styles.resultTitle}>
              {isPassing ? "Félicitations!" : "Continuez à vous entraîner !"}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Text style={styles.resultSubtitle}>
              {isPassing
                ? "Vous avez réussi avec brio!"
                : "Vous y êtes presque, persévérez!"}
            </Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.lottieContainer, scoreCircleStyle]}>
          <LottieView
            ref={lottieRef}
            source={
              isPassing
                ? require("@/assets/animations/success-celebration.json")
                : require("@/assets/animations/study-harder.json")
            }
            style={styles.lottieAnimation}
            loop={isPassing}
            autoPlay={false}
          />
        </Animated.View>

        <Animated.View style={[styles.resultCard, cardStyle]}>
          <View style={styles.scoreSection}>
            <Animated.View
              style={styles.scoreCircle}
              entering={ZoomIn.delay(1000).duration(800)}
            >
              <Text style={styles.scoreText}>
                {resultData.scorePercentage}%
              </Text>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(1300)}>
              <Text style={styles.scoreLabel}>
                {isPassing ? "Excellent Score!" : "Votre Score"}
              </Text>
            </Animated.View>
          </View>

          <View style={styles.divider} />

          <Animated.View style={[styles.statsContainer, detailsStyle]}>
            <View style={styles.statItem}>
              <MaterialIcons
                name="check-circle"
                size={32}
                color={Colors.light.success}
              />
              <Text style={styles.statValue}>{resultData.correctAnswers}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>

            <View style={styles.statSeparator} />

            <View style={styles.statItem}>
              <MaterialIcons
                name="highlight-off"
                size={32}
                color={Colors.light.error}
              />
              <Text style={styles.statValue}>
                {resultData.totalQuestions - resultData.correctAnswers}
              </Text>
              <Text style={styles.statLabel}>Incorrect</Text>
            </View>

            <View style={styles.statSeparator} />

            <View style={styles.statItem}>
              <MaterialIcons
                name="timer"
                size={32}
                color={Colors.light.primary}
              />
              <Text style={styles.statValue}>
                {resultData.timeTaken
                  ? formatTime(resultData.timeTaken)
                  : "00:00"}
              </Text>
              <Text style={styles.statLabel}>Temps</Text>
            </View>
          </Animated.View>

          <Animated.View style={detailsStyle}>
            <Text style={styles.questionsHeader}>Aperçu des questions</Text>

            <ScrollView
              style={styles.questionsList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.questionsListContent}
            >
              {resultData.questions.map((question: any, index: number) => (
                <Animated.View
                  key={index}
                  style={styles.questionItem}
                  entering={SlideInUp.delay(1500 + index * 100).springify()}
                >
                  <View
                    style={[
                      styles.questionStatus,
                      {
                        backgroundColor: question.isCorrect
                          ? Colors.light.success
                          : Colors.light.error,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={question.isCorrect ? "check" : "close"}
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>

                  <View style={styles.questionContent}>
                    <Text style={styles.questionText}>
                      Question {index + 1}
                    </Text>
                    {question.hasImage && (
                      <Ionicons
                        name="image-outline"
                        size={16}
                        color={Colors.light.text}
                      />
                    )}
                  </View>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        </Animated.View>

        <Animated.View style={styles.actionButtonsContainer}>
          <Animated.View style={buttonStyle}>
            <TouchableOpacity
              style={[styles.actionButton, styles.detailButton]}
              onPress={() => handleButtonPress("detail")}
              onPressIn={() => handlePressIn(buttonScale)}
              onPressOut={() => handlePressOut(buttonScale)}
            >
              <Ionicons name="bulb-outline" size={30} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Détails</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={buttonStyle}>
            <TouchableOpacity
              style={[styles.actionButton, styles.homeButton]}
              onPress={() => handleButtonPress("home")}
              onPressIn={() => handlePressIn(buttonScale)}
              onPressOut={() => handlePressOut(buttonScale)}
            >
              <Ionicons name="home" size={30} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Accueil</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={buttonStyle}>
            <TouchableOpacity
              style={[styles.actionButton, styles.backButton]}
              onPress={() => handleButtonPress("back")}
              onPressIn={() => handlePressIn(buttonScale)}
              onPressOut={() => handlePressOut(buttonScale)}
            >
              <Ionicons name="refresh" size={30} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Revenir</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  resultSubtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: 5,
  },
  lottieContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
  },
  lottieAnimation: {
    width: 300,
    height: 300,
  },
  resultCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 20,
  },
  scoreSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: Colors.light.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginVertical: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statSeparator: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.6)",
    marginTop: 4,
  },
  questionsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 12,
  },
  questionsList: {
    maxHeight: 180,
  },
  questionsListContent: {
    paddingBottom: 8,
  },
  questionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    overflow: "hidden",
  },
  questionStatus: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  questionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  questionText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  detailButton: {
    backgroundColor: Colors.light.primary,
  },
  homeButton: {
    backgroundColor: Colors.light.purple,
  },
  backButton: {
    backgroundColor: Colors.light.success,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    marginTop: 6,
  },
})

export default ResultScreen
