import React, { useRef, useEffect } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  Touchable,
  Dimensions,
  ActivityIndicator,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native"
import { ThemedText as Text } from "@/components/ThemedText"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"
import { MaterialIcons } from "@expo/vector-icons"
import { Quiz } from "@/types/Quiz"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import LottieView from "lottie-react-native"

const { width } = Dimensions.get("window")

const QuizList = ({
  quizTrainings,
  onPressQuiz,
  isLoading = false,
}: {
  quizTrainings: Array<Quiz>
  onPressQuiz: (quiz: Quiz) => void
  isLoading?: boolean
}) => {
  const lottieRef = useRef<LottieView>(null)

  // Animation for card press
  const getCardScale = (index: number) => {
    return useSharedValue(1)
  }

  const getCardAnimStyle = (scale: Animated.SharedValue<number>) => {
    return useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      }
    })
  }

  useEffect(() => {
    if (isLoading && lottieRef.current) {
      lottieRef.current.play()
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.lottieContainer}>
          <LottieView
            ref={lottieRef}
            source={require("@/assets/animations/quiz-loading.json")}
            style={styles.lottieAnimation}
            autoPlay
            loop
          />
        </View>
        <Text style={styles.loadingText}>Chargement des quiz...</Text>
      </View>
    )
  }

  if (quizTrainings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons
          name="search-off"
          size={60}
          color={Colors.light.bgPrimary}
        />
        <Text style={styles.emptyText}>Aucun quiz disponible</Text>
        <Text style={styles.emptySubtext}>
          Revenez plus tard pour de nouveaux quiz
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.quizListContainer}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {quizTrainings.map((quiz, index) => {
        return (
          <View key={index} style={[styles.cardContainer]}>
            <TouchableOpacity
              onPress={() => onPressQuiz(quiz)}
              style={styles.touchable}
            >
              <LinearGradient
                colors={[Colors.light.active, Colors.light.bgPrimary]}
                style={styles.quizItem}
              >
                <View style={styles.quizHeader}>
                  <Text style={styles.quizTitle}>{quiz.title}</Text>
                  <View style={styles.quizLevel}>
                    {[...Array(quiz.level)].map((_, index) => (
                      <MaterialIcons
                        key={index}
                        name="star"
                        size={20}
                        color={Colors.light.star || "#FFD700"}
                      />
                    ))}
                    {[...Array(5 - quiz.level)].map((_, index) => (
                      <MaterialIcons
                        key={index + quiz.level}
                        name="star-border"
                        size={20}
                        color={Colors.light.star || "#FFD700"}
                      />
                    ))}
                  </View>
                </View>

                <Text style={styles.quizDescription} numberOfLines={2}>
                  {quiz.description}
                </Text>

                <View style={styles.divider} />

                <View style={styles.quizFooter}>
                  <View style={styles.footerItem}>
                    <MaterialIcons
                      name="timer"
                      size={18}
                      color={Colors.light.icon || "white"}
                      style={styles.icon}
                    />
                    <Text style={styles.quizInfo}>{quiz.time} mins</Text>
                  </View>

                  <View style={styles.footerItem}>
                    <MaterialIcons
                      name="lightbulb"
                      size={18}
                      color={Colors.light.icon || "white"}
                      style={styles.icon}
                    />
                    <Text style={styles.quizInfo}>
                      {quiz.quizQuestions.length} questions
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => onPressQuiz(quiz)}
                  >
                    <Text style={styles.startButtonText}>Commencer</Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={18}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  quizListContainer: {
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    width: "100%",
    backgroundColor: Colors.light.bgPrimary,
    borderRadius: 15,
    marginBottom: 15,
  },
  touchable: {
    width: "100%",
  },
  quizItem: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  quizTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  quizLevel: {
    flexDirection: "row",
  },
  quizDescription: {
    color: "white",
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 15,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 12,
  },
  quizFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  quizInfo: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  icon: {
    marginRight: 5,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  lottieContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  lottieAnimation: {
    width: "100%",
    height: "100%",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.bgPrimary,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 20,
    color: Colors.light.bgPrimary,
    fontWeight: "bold",
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.light.text,
    textAlign: "center",
    opacity: 0.7,
  },
})

export default QuizList
