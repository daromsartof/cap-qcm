import React from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { ThemedText as Text } from "@/components/ThemedText"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"
import { MaterialIcons } from "@expo/vector-icons" // For star and other icons
import { Quiz } from "@/types/Quiz"

const QuizList = ({ quizTrainings, onPressQuiz }: {
  quizTrainings: Array<Quiz>
  onPressQuiz: (quiz: Quiz) => void
}) => {
  return (
    <ScrollView
      style={styles.quizListContainer}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      {quizTrainings.map((quiz) => (
        <TouchableOpacity
          key={quiz.id}
          onPress={() => onPressQuiz(quiz)} // Handle onPress for each quiz
          activeOpacity={0.8} // Add a slight opacity effect on press
        >
          <LinearGradient
            key={quiz.id}
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
                    color={Colors.light.star}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.quizDescription}>{quiz.description}</Text>
            <View style={styles.quizFooter}>
              <MaterialIcons
                name="timer"
                size={18}
                color={Colors.light.icon}
                style={styles.icon}
              />
              <Text style={styles.quizInfo}>{quiz.time} mins</Text>
              <MaterialIcons
                name="question-answer"
                size={18}
                color={Colors.light.icon}
                style={styles.icon}
              />
              <Text style={styles.quizInfo}>{quiz.quizQuestions.length} questions</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  quizListContainer: {
    width: "100%"
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
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  quizTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  quizLevel: {
    flexDirection: "row",
  },
  quizDescription: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 10,
  },
  quizFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  quizInfo: {
    color: "white",
    fontSize: 14,
    marginRight: 15,
    opacity: 0.8,
  },
  icon: {
    marginRight: 5,
  },
})

export default QuizList
