import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { CircularProgressBase } from "react-native-circular-progress-indicator"
import { Colors } from "@/constants/Colors"

const { width } = Dimensions.get("window")

interface Subject {
  id: number
  name: string
}

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  subjectId: number
}

const subjects: Subject[] = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "History" },
  { id: 3, name: "Science" },
  { id: 4, name: "Literature" },
]

const mockQuestions: Question[] = [
  {
    id: 1,
    question: "What's the result of 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
    subjectId: 1,
  },
  // Add more questions...
]

const QuizScreen: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isQuizFinished, setIsQuizFinished] = useState(false)

  const questions = mockQuestions.filter(
    (q) => q.subjectId === selectedSubject?.id
  )

  useEffect(() => {
    if (!isQuizFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      finishQuiz()
    }
  }, [timeLeft, isQuizFinished])

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setTimeLeft(30)
        setSelectedAnswer(null)
      } else {
        finishQuiz()
      }
    }, 1000)
  }

  const finishQuiz = () => {
    setIsQuizFinished(true)
    setTimeLeft(0)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setTimeLeft(30)
    setIsQuizFinished(false)
    setSelectedAnswer(null)
  }

  if (!selectedSubject) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors.light.background }]}
      >
        <Text style={styles.title}>Select a Subject</Text>
        <View style={styles.subjectContainer}>
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={[
                styles.subjectCard,
                { backgroundColor: Colors.light.bgPrimary },
              ]}
              onPress={() => setSelectedSubject(subject)}
            >
              <Text style={[styles.subjectText, { color: Colors.light.text }]}>
                {subject.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    )
  }

  if (isQuizFinished) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors.light.background }]}
      >
        <View style={styles.resultContainer}>
          <Text style={[styles.resultTitle, { color: Colors.light.text }]}>
            Quiz Finished!
          </Text>
          <Text style={[styles.scoreText, { color: Colors.light.tint }]}>
            Your Score: {score}/{questions.length}
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors.light.tint }]}
              onPress={resetQuiz}
            >
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: Colors.light.bgPrimary },
              ]}
              onPress={() => setSelectedSubject(null)}
            >
              <Text style={styles.buttonText}>Choose Another Subject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.light.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedSubject(null)}>
          <AntDesign name="arrowleft" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <CircularProgressBase
          value={timeLeft}
          radius={25}
          maxValue={30}
          activeStrokeColor={Colors.light.tint}
          inActiveStrokeColor={Colors.light.icon}
          activeStrokeWidth={5}
          inActiveStrokeWidth={5}
        />
        <Text style={[styles.score, { color: Colors.light.text }]}>
          Score: {score}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${(currentQuestion / questions.length) * 100}%`,
              backgroundColor: Colors.light.tint,
            },
          ]}
        />
        <Text style={[styles.progressText, { color: Colors.light.icon }]}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.questionContainer,
          { backgroundColor: Colors.light.background },
        ]}
      >
        <Text style={[styles.questionText, { color: Colors.light.text }]}>
          {questions[currentQuestion].question}
        </Text>

        {questions[currentQuestion].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              { backgroundColor: Colors.light.background },
              selectedAnswer === option && {
                backgroundColor:
                  option === questions[currentQuestion].correctAnswer
                    ? Colors.light.tint
                    : "#e74c3c",
              },
            ]}
            onPress={() => handleAnswer(option)}
            disabled={!!selectedAnswer}
          >
            <Text style={[styles.optionText, { color: Colors.light.text }]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  subjectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  subjectCard: {
    width: width / 2 - 30,
    height: 120,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: "600",
  },
  progressContainer: {
    height: 5,
    backgroundColor: "#ecf0f1",
    borderRadius: 5,
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  progressText: {
    textAlign: "right",
    fontSize: 12,
    marginTop: 5,
  },
  questionContainer: {
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.icon,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 30,
  },
  buttonGroup: {
    width: "100%",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  score: {
    fontSize: 18,
    fontWeight: "600",
  },
})

export default QuizScreen
