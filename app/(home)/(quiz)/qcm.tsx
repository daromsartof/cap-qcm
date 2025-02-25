import React, { useEffect, useState } from "react"
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"
import { MaterialIcons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Quiz } from "@/types/Quiz"
import QuizCategory from "@/types/QuizCategory"
import { QuizMatieres } from "@/types/QuizMatieres"
import { MAIN_URL } from "@/constants/Url"
import { useAuth } from "@/contexts/AutContext"
import { User } from "@/types/User"
import { getQuizResult } from "@/services/userQuiz.service"
import { Text } from "react-native-paper"
import RenderHTML from "react-native-render-html"

const QuizQCM = ({ }) => {
  const router = useRouter()
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [quizData, setQuizData] = useState<QuizCategory[]>([])
  const { quiz } = useLocalSearchParams<{
    quiz: string
  }>()
  const [questionContainerWidth, setQuestionContainerWidth] = useState(0);
  const [questionImageDimensions, setQuestionImageDimensions] = useState({ width: 0, height: 0 });
  const [answerContainerWidth, setAnswerContainerWidth] = useState(0);
  const [answerImageDimensions, setAnswerImageDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(false)
  const quiz_data: Quiz | null = quiz ? JSON.parse(quiz) : null
  const { user } = useAuth()
  const { width } = useWindowDimensions()

  const handleGetQuestionQuiz = (quiz: Quiz) => {
    setQuizData(() => {
      let timeSeconde = 0
      const quizData =  quiz.quizMatieres.map((m: QuizMatieres) => {
          timeSeconde += (m.time * 60)
          return ({
          id: m.matiere.id,
          name: m.matiere.title,
          questions: quiz.quizQuestions
            .filter((q) => q.question.matiereId === m.matiereId)
            .map((q) => ({
              id: q.question.id,
              text: q.question.title,
              image: q.question.fileUrl,
              answerImage: q.question.response_file_url,
              answers: q.question.answers.map((a) => ({
                id: a.id,
                text: a.title,
              })),
            })),
        })
      })
      console.log("timeSeconde", timeSeconde);
      
      setTimeLeft(timeSeconde)
      return quizData
    })
    /*setQuizData(
      quiz.quizMatieres.map((m) => ({
        id: m.matiere.id,
        name: m.matiere.title,
        questions: quiz.quizQuestions.filter((q) => q.question.matiereId === m.matiereId).map(q => ({
          id: q.id,
          text: q.question.title,
          answers: q.question.answers.map((a) => ({
            id: a.id,
            text: a.title,
          })),
        })),
      }))
    )*/
  }
  // Timer countdown
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft])

  useEffect(() => {
    if (quiz_data) {
      setTimeLeft(quiz_data.time * 60)
      handleGetQuestionQuiz(quiz_data)
    }

    return () => {
      setQuizData([])
    }
  }, [quiz])

  // Handle answer selection
  const handleAnswerSelect = (answerId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [`${currentSubjectIndex}-${currentQuestionIndex}`]: answerId,
    }))
  }

  // Handle next/previous question
  const handleNavigation = (direction) => {
    if (direction === "next") {
      if (
        currentQuestionIndex <
        quizData[currentSubjectIndex].questions.length - 1
      ) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else if (currentSubjectIndex < quizData.length - 1) {
        // Move to the next subject
        setCurrentSubjectIndex((prev) => prev + 1)
        setCurrentQuestionIndex(0)
      }
    } else if (direction === "prev") {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1)
      } else if (currentSubjectIndex > 0) {
        // Move to the previous subject
        setCurrentSubjectIndex((prev) => prev - 1)
        setCurrentQuestionIndex(
          quizData[currentSubjectIndex - 1].questions.length - 1
        )
      }
    }
  }

  // Handle subject tab click
  const handleSubjectTabClick = (subjectIndex) => {
    setCurrentSubjectIndex(subjectIndex)
    setCurrentQuestionIndex(0) // Reset to the first question of the selected subject
  }

  // Handle quiz submission
  const handleSubmit = async () => {
    if (!quiz_data) return

    const submissionData = {
      quizId: quiz_data.id, // ID du quiz
      userId: user?.user.id, // Remplace par l'ID de l'utilisateur (ex: depuis le contexte ou Redux)
      data: Object.keys(selectedAnswers).map((key) => {
        const [subjectIndex, questionIndex] = key.split("-").map(Number)
        const question = quizData[subjectIndex]?.questions[questionIndex]
        console.log("question ", question);
        
        return {
          questionId: question?.id,
          answerId: selectedAnswers[key],
        }
      }),
    }
    setIsLoading(true)
    const results = await getQuizResult(submissionData)
    setIsLoading(false)
    router.push({
      pathname: "/(home)/(quiz)/result",
      params: { results: JSON.stringify(results) },
    })
  }

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get current question data
  const currentQuestion: {
    id: number
    text: string
    image: string | null
    answerImage: string | null
    answers: {
      id: number
      text: string
    }[]
  } =
    quizData.length > 0
      ? quizData[currentSubjectIndex].questions[currentQuestionIndex]
      : {
        id: 0,
        text: "",
        image: null,
        answerImage: null,
        answers: [],
      }
  return (
    <LinearGradient
      colors={[Colors.light.background, Colors.light.background]}
      style={styles.container}
    >
      {/* Timer */}
      <View style={styles.timerContainer}>
        <MaterialIcons name="timer" size={24} color={Colors.light.text} />
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      {/* Horizontal Scrollable Subject Tabs */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subjectTabsContainer}
        >
          {quizData.map((subject, index) => (
            <TouchableOpacity
              key={subject.id}
              style={[
                styles.subjectTab,
                currentSubjectIndex === index && styles.activeSubjectTab,
              ]}
              onPress={() => handleSubjectTabClick(index)}
            >
              <Text
                style={[
                  styles.subjectTabText,
                  currentSubjectIndex === index && styles.activeSubjectTabText,
                ]}
              >
                {subject.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Question and Response Options */}
      <ScrollView showsVerticalScrollIndicator={false}  contentContainerStyle={styles.scrollContent}>
        <View style={styles.questionContainer}>
          <View
            style={{
              marginBottom: 40,
              justifyContent: "center",
              alignItems: "center",
              borderBottomColor: Colors.light.bgPrimary,
              borderBottomWidth: 1,
            }}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setQuestionContainerWidth(width);
            }}
          >
              <RenderHTML  contentWidth={width} source={{ html: `<p style="text-align:center; font-size:18px">${currentQuestion?.text}</p>` }} />
        
            {
              currentQuestion.image && (
                <Image
                  source={{
                    uri: `${MAIN_URL}${currentQuestion?.image}`
                  }}
                  style={{
                    width: "100%",
                    height: questionContainerWidth && questionImageDimensions.width
                      ? (questionContainerWidth * questionImageDimensions.height / questionImageDimensions.width)
                      : 300, // Fallback height
                    resizeMode: "contain",
                  }}
                  onLoad={(event) => {
                    const { width, height } = event.nativeEvent.source;
                    setQuestionImageDimensions({ width, height });
                  }}
                />
              )
            }
          </View>
          <View style={{ marginBottom: 20 }} onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setAnswerContainerWidth(width);
          }}>
            {

              currentQuestion.answerImage && (
                <Image
                  source={{
                    uri: `${MAIN_URL}${currentQuestion?.answerImage}`
                  }}
                  style={{
                    width: "100%",
                    height: answerContainerWidth && answerImageDimensions.width
                      ? (answerContainerWidth * answerImageDimensions.height / answerImageDimensions.width)
                      : 300, // Fallback height
                    resizeMode: "contain",
                  }}
                  onLoad={(event) => {
                    const { width, height } = event.nativeEvent.source;
                    setAnswerImageDimensions({ width, height });
                  }}
                />
              )
            }
            {currentQuestion?.answers.map((answer) => (
              <TouchableOpacity
                key={answer.id}
                style={[
                  styles.answerOption,
                  selectedAnswers[
                  `${currentSubjectIndex}-${currentQuestionIndex}`
                  ] === answer.id && styles.selectedAnswerOption,
                ]}
                onPress={() => handleAnswerSelect(answer.id)}
              >
                <Text
                  style={[
                    styles.answerText,
                    selectedAnswers[
                    `${currentSubjectIndex}-${currentQuestionIndex}`
                    ] === answer.id && styles.selectedanswerText,
                  ]}
                >
                  {answer.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Navigation Buttons (Prev/Next) */}
      <View style={styles.floatingNavContainer}>
        <TouchableOpacity
          style={[
            styles.navArrow,
            (currentSubjectIndex === 0 && currentQuestionIndex === 0) && styles.disabledArrow
          ]}
          onPress={() => handleNavigation("prev")}
          disabled={currentSubjectIndex === 0 && currentQuestionIndex === 0}
        >
          <MaterialIcons name="chevron-left" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navArrow,
            (currentSubjectIndex === quizData.length - 1 &&
              currentQuestionIndex ===
              quizData[currentSubjectIndex].questions.length - 1) && styles.disabledArrow
          ]}
          onPress={() => handleNavigation("next")}
          disabled={
            currentSubjectIndex === quizData.length - 1 &&
            currentQuestionIndex ===
            quizData[currentSubjectIndex].questions.length - 1
          }
        >
          <MaterialIcons name="chevron-right" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.bgPrimary]}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <MaterialIcons name="send" size={20} color="white" />
          <Text style={styles.submitButtonText}>
            {isLoading ? "En cours..." : "Soumettre le questionnaire"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 120, // Space for floating elements
  },
  floatingNavContainer: {
    position: 'absolute',
    bottom: 120,
    backgroundColor: Colors.light.background,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navArrow: {
    backgroundColor: Colors.light.active,
    width: 120,
    height: 50,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledArrow: {
    opacity: 0.5,
  },
  submitButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientButton: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginLeft: 10,
  },
  subjectTabsContainer: {
    marginBottom: 20,
  },
  subjectTab: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Colors.light.inactive,
  },
  activeSubjectTab: {
    backgroundColor: Colors.light.active,
  },
  subjectTabText: {
    color: Colors.light.text,
    fontSize: 16,
  },
  activeSubjectTabText: {
    color: "white",
    fontWeight: "bold",
  },
  questionContainer: {
    marginBottom: 20,
    marginTop: 20,
    flex: 1,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text
  },
  answerOption: {
    padding: 15,
    borderRadius: 10,
    borderColor: Colors.light.active,
    borderWidth: 1,
    backgroundColor: Colors.light.inactive,
    marginBottom: 10,
  },
  selectedAnswerOption: {
    backgroundColor: Colors.light.active,
  },
  selectedanswerText: {
    color: "white",
    fontWeight: "bold",
  },
  answerText: {
    color: Colors.light.text,
    fontSize: 16,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  navButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.light.active,
    width: "45%",
    alignItems: "center",
  },
  navButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }
})

export default QuizQCM
