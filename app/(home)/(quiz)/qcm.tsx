import React, { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"
import { MaterialIcons } from "@expo/vector-icons"

const QuizQCM = ({  }) => {
    const quizData = [
      {
        id: 1,
        name: "Math",
        questions: [
          {
            id: 1,
            text: "What is 2 + 2?",
            answers: [
              { id: 1, text: "3" },
              { id: 2, text: "4" },
              { id: 3, text: "5" },
              { id: 4, text: "6" },
            ],
          },
          {
            id: 2,
            text: "What is 3 * 3?",
            answers: [
              { id: 1, text: "6" },
              { id: 2, text: "9" },
              { id: 3, text: "12" },
              { id: 4, text: "15" },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "Science",
        questions: [
          {
            id: 1,
            text: "What is the chemical symbol for water?",
            answers: [
              { id: 1, text: "H2O" },
              { id: 2, text: "CO2" },
              { id: 3, text: "O2" },
              { id: 4, text: "NaCl" },
            ],
          },
          {
            id: 2,
            text: "What is the boiling point of water?",
            answers: [
              { id: 1, text: "50°C" },
              { id: 2, text: "100°C" },
              { id: 3, text: "150°C" },
              { id: 4, text: "200°C" },
            ],
          },
        ],
      },
    ]
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds

  // Timer countdown
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft])

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
  const handleSubmit = () => {
    console.log("Selected Answers:", selectedAnswers)
    alert("Quiz submitted successfully!")
  }

  // Format time (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Get current question data
  const currentQuestion =
    quizData[currentSubjectIndex].questions[currentQuestionIndex]

  return (
    <LinearGradient
      colors={[Colors.light.background, Colors.light.bgPrimary]}
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
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
        {currentQuestion.answers.map((answer) => (
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
                ] === answer.id && styles.selectedanswerText
              ]}
            >
              {answer.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation Buttons (Prev/Next) */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleNavigation("prev")}
          disabled={currentSubjectIndex === 0 && currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleNavigation("next")}
          disabled={
            currentSubjectIndex === quizData.length - 1 &&
            currentQuestionIndex ===
              quizData[currentSubjectIndex].questions.length - 1
          }
        >
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Quiz</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginTop: 50,
    flex: 1,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 40,
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
  selectedanswerText:{
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
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.light.bgPrimary,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default QuizQCM
