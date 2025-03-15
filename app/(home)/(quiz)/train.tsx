import HalfBgContainer from "@/components/HalfBgContainer"
import { Colors } from "@/constants/Colors"
import React, { useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native"
import { ThemedText as Text } from "@/components/ThemedText"
import { Link, useLocalSearchParams, useRouter } from "expo-router"
import QuizList from "@/components/QuizList"
import { getAllQuiz } from "@/services/quiz.service"
import { Quiz } from "@/types/Quiz"
import { MaterialIcons } from "@expo/vector-icons"
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")

const QuizTrainScreen = () => {
  const { categorie } = useLocalSearchParams<{
    categorie: string
  }>()
  const router = useRouter()
  const categorieData = categorie ? JSON.parse(categorie) : {}
  const [quizs, setQuizs] = useState<Array<Quiz>>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleFetchQuiz = async () => {
    setIsLoading(true)
    try {
      const quizs = await getAllQuiz({
        categorieId: categorieData.id,
      })
      setQuizs(quizs)
    } catch (error) {
      console.error("Error fetching quizzes:", error)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleFetchQuiz()

    return () => {
      setQuizs([])
    }
  }, [categorie])

  return (
    <HalfBgContainer>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        <Animated.View
          style={styles.header}
          entering={SlideInDown.delay(100).springify()}
        >
          <LinearGradient
            colors={[Colors.light.active, Colors.light.bgPrimary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Text style={styles.categoryTitle}>{categorieData.title}</Text>
            <Text style={styles.categoryDescription}>
              {categorieData.description || "Entraînez-vous avec nos quiz"}
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialIcons name="question-answer" size={20} color="white" />
                <Text style={styles.statText}>{quizs.length} Quiz</Text>
              </View>

              <View style={styles.statItem}>
                <MaterialIcons name="trending-up" size={20} color="white" />
                <Text style={styles.statText}>Progression: 35%</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={styles.content}
          entering={FadeInDown.delay(300).duration(500)}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Quiz disponibles</Text>
            <View style={styles.titleLine} />
          </View>

          <QuizList
            quizTrainings={quizs}
            onPressQuiz={(quiz) => {
              router.push({
                pathname: "/(home)/(quiz)/qcm",
                params: { quiz: JSON.stringify(quiz) },
              })
            }}
            isLoading={isLoading}
          />
        </Animated.View>
      </View>
    </HalfBgContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  headerGradient: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  categoryTitle: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  categoryDescription: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  statText: {
    color: "white",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: Colors.light.bgPrimary,
    fontWeight: "bold",
    marginRight: 15,
  },
  titleLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.light.bgPrimary,
    opacity: 0.3,
  },
})

export default QuizTrainScreen
