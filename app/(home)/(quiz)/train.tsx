import HalfBgContainer from "@/components/HalfBgContainer"
import { Colors } from "@/constants/Colors"
import React, { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { ThemedText as Text } from "@/components/ThemedText"
import { Link, useLocalSearchParams } from "expo-router"
import QuizList from "@/components/QuizList"
import { useRouter } from "expo-router"
import { getAllQuiz } from "@/services/quiz.service"
import { Quiz } from "@/types/Quiz"

const QuizTrainScreen = () => {
  const { categorie } = useLocalSearchParams<{
    categorie: string
  }>()
  const router = useRouter()
  const categorieData = categorie ? JSON.parse(categorie) : {}
  const [quizs, setQuizs] = useState<Array<Quiz>>([])

  const handleFetchQuiz = async () => {
    const quizs = await getAllQuiz({
      categorieId: categorieData.id,
    })

    setQuizs(quizs)
  }

  useEffect(() => {
    handleFetchQuiz()

    return () => {
      setQuizs([])
    }
  }, [categorie])

  return (
    <HalfBgContainer>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>CAP QCM</Text>
        </View>
        <QuizList
          quizTrainings={quizs}
          onPressQuiz={(quiz) => {
            router.push({
              pathname: "/(home)/(quiz)/qcm",
              params: { quiz: JSON.stringify(quiz) },
            })
          }}
        />
      </View>
    </HalfBgContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
  },
  headerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    color: Colors.light.bgPrimary,
    fontWeight: "bold",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  toggleContainer: {
    width: "90%",
    height: 170,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  toggleText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    width: "100%",
    alignItems: "center",
  },
  buttonInnerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  quizListContainer: {
    width: "100%",
    marginTop: 10,
  },
  quizItem: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  quizTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  quizDescription: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
  },
})

export default QuizTrainScreen
