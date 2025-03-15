import { Colors } from "@/constants/Colors"
import { MAIN_URL } from "@/constants/Url"
import { MaterialIcons, Ionicons, AntDesign, Feather } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useState, useEffect, useRef } from "react"
import {
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native"
import { ScrollView, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolation,
  runOnJS,
} from "react-native-reanimated"
import LottieView from "lottie-react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { BlurView } from "expo-blur"

const { width, height } = Dimensions.get("window")

const ResultDetailScreen = () => {
  const { results } = useLocalSearchParams<{ results: string }>()
  const resultData = JSON.parse(results!)
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const [imageViewerVisible, setImageViewerVisible] = useState(false)
  const [currentImage, setCurrentImage] = useState("")
  const router = useRouter()
  const scrollRef = useRef<ScrollView>(null)
  const headerOpacity = useSharedValue(0)
  const buttonScale = useSharedValue(1)

  // Stats
  const correctCount = resultData.questions.filter(
    (q: any) => q.isCorrect
  ).length
  const incorrectCount = resultData.questions.length - correctCount
  const passedExam = resultData.scorePercentage >= 70

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 })
  }, [])

  const toggleQuestion = (index: number) => {
    if (expandedQuestion === index) {
      setExpandedQuestion(null)
    } else {
      setExpandedQuestion(index)
      // Scroll to the question if it's far down
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            y: index * 100, // Approximate calculation
            animated: true,
          })
        }
      }, 300)
    }
  }

  const openImageViewer = (imageUrl: string) => {
    setCurrentImage(imageUrl)
    setImageViewerVisible(true)
  }

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 })
  }

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 })
  }

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: interpolate(
          headerOpacity.value,
          [0, 1],
          [-20, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }))

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const getQuestionEnteringStyle = (index: number) =>
    FadeInDown.delay(100 + index * 80).duration(400)

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={passedExam ? ["#4F7942", "#2E8B57"] : ["#8B4513", "#CD853F"]}
        style={styles.detailContainer}
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <View style={styles.headerContent}>
            <LottieView
              source={require("@/assets/animations/review-animation.json")}
              style={styles.headerAnimation}
              autoPlay
              loop
            />
            <Text style={styles.detailTitle}>Résultats détaillés</Text>
            <Text style={styles.detailSubtitle}>
              {correctCount} correctes sur {resultData.questions.length}{" "}
              questions
            </Text>
          </View>
        </Animated.View>

        {/* Stats section */}
        <Animated.View
          style={styles.statsOverview}
          entering={FadeInDown.delay(300).duration(500)}
        >
          <View style={styles.statItemLarge}>
            <Text style={styles.statValue}>{resultData.scorePercentage}%</Text>
            <Text style={styles.statLabel}>Score Total</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Feather
                name="check-circle"
                size={18}
                color={Colors.light.success}
              />
              <Text style={styles.statValueSmall}>{correctCount}</Text>
              <Text style={styles.statLabelSmall}>Correctes</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Feather name="x-circle" size={18} color={Colors.light.error} />
              <Text style={styles.statValueSmall}>{incorrectCount}</Text>
              <Text style={styles.statLabelSmall}>Incorrectes</Text>
            </View>
          </View>
        </Animated.View>

        {/* Questions list */}
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {resultData.questions.map((question: any, index: number) => (
            <Animated.View
              key={index}
              entering={getQuestionEnteringStyle(index)}
            >
              <Pressable
                style={[
                  styles.questionCard,
                  question.isCorrect
                    ? styles.correctCard
                    : styles.incorrectCard,
                  expandedQuestion === index && styles.expandedCard,
                ]}
                onPress={() => toggleQuestion(index)}
                android_ripple={{ color: "rgba(0,0,0,0.1)" }}
              >
                <View style={styles.questionHeader}>
                  <View style={styles.questionHeaderLeft}>
                    <MaterialIcons
                      name={question.isCorrect ? "check-circle" : "cancel"}
                      size={24}
                      color={
                        question.isCorrect
                          ? Colors.light.success
                          : Colors.light.error
                      }
                    />
                    <Text style={styles.questionNumber}>
                      Question {index + 1}
                    </Text>
                  </View>

                  <View style={styles.questionHeaderRight}>
                    {question.hasImage && (
                      <MaterialIcons
                        name="image"
                        size={20}
                        color={Colors.light.primary}
                      />
                    )}
                    <AntDesign
                      name={expandedQuestion === index ? "up" : "down"}
                      size={16}
                      color={Colors.light.textSecondary}
                    />
                  </View>
                </View>

                {expandedQuestion === index && (
                  <Animated.View
                    style={styles.questionDetails}
                    entering={FadeInDown.duration(300)}
                    exiting={FadeOut.duration(200)}
                  >
                    <Text style={styles.questionText}>{question.text}</Text>

                    {question.image && (
                      <TouchableOpacity
                        onPress={() =>
                          openImageViewer(`${MAIN_URL}${question.image}`)
                        }
                        activeOpacity={0.9}
                      >
                        <Image
                          source={{ uri: `${MAIN_URL}${question.image}` }}
                          style={styles.questionImage}
                          resizeMode="contain"
                        />
                        <View style={styles.imageOverlay}>
                          <Text style={styles.imageOverlayText}>Agrandir</Text>
                          <Feather name="maximize" size={14} color="white" />
                        </View>
                      </TouchableOpacity>
                    )}

                    <View style={styles.answerSection}>
                      <Text style={styles.answersSectionTitle}>Réponses</Text>

                      <View
                        style={[
                          styles.answerRow,
                          !question.isCorrect && styles.wrongAnswerRow,
                        ]}
                      >
                        <View style={styles.answerIconContainer}>
                          {question.isCorrect ? (
                            <Feather
                              name="check"
                              size={18}
                              color={Colors.light.success}
                            />
                          ) : (
                            <Feather
                              name="x"
                              size={18}
                              color={Colors.light.error}
                            />
                          )}
                        </View>
                        <View style={styles.answerTextContainer}>
                          <Text style={styles.answerLabel}>Votre Réponse:</Text>
                          <Text
                            style={[
                              styles.answerText,
                              !question.isCorrect && styles.wrongAnswerText,
                            ]}
                          >
                            {question.userAnswer}
                          </Text>
                        </View>
                      </View>

                      {!question.isCorrect && (
                        <View
                          style={[styles.answerRow, styles.correctAnswerRow]}
                        >
                          <View style={styles.answerIconContainer}>
                            <Feather
                              name="check"
                              size={18}
                              color={Colors.light.success}
                            />
                          </View>
                          <View style={styles.answerTextContainer}>
                            <Text style={styles.answerLabel}>
                              Bonne réponse :
                            </Text>
                            <Text
                              style={[
                                styles.answerText,
                                styles.correctAnswerText,
                              ]}
                            >
                              {question.correctAnswer}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>

                    {question.answerImage && (
                      <View style={styles.answerImageContainer}>
                        <Text style={styles.answerImageTitle}>
                          Image de référence:
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            openImageViewer(
                              `${MAIN_URL}${question.answerImage}`
                            )
                          }
                          activeOpacity={0.9}
                        >
                          <Image
                            source={{
                              uri: `${MAIN_URL}${question.answerImage}`,
                            }}
                            style={styles.answerImage}
                            resizeMode="contain"
                          />
                          <View style={styles.imageOverlay}>
                            <Text style={styles.imageOverlayText}>
                              Agrandir
                            </Text>
                            <Feather name="maximize" size={14} color="white" />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}

                    <View style={styles.explanationContainer}>
                      <Text style={styles.explanationTitle}>Explication :</Text>
                      <Text style={styles.explanationText}>
                        {question.explanation ||
                          "Aucune explication disponible pour cette question."}
                      </Text>
                    </View>
                  </Animated.View>
                )}
              </Pressable>
            </Animated.View>
          ))}

          <View style={styles.spacer} />
        </ScrollView>

        {/* Footer Actions */}
        <Animated.View
          style={styles.actionsContainer}
          entering={FadeInUp.delay(600).duration(500)}
        >
          <Animated.View style={buttonStyle}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Ionicons name="arrow-back-circle" size={24} color="white" />
              <Text style={styles.backButtonText}>Retour aux résultats</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Image Viewer Modal */}
        <Modal
          visible={imageViewerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setImageViewerVisible(false)}
        >
          <BlurView
            intensity={90}
            style={styles.imageViewerContainer}
            tint="dark"
          >
            <TouchableWithoutFeedback
              onPress={() => setImageViewerVisible(false)}
            >
              <View style={styles.imageViewerBackground}>
                <View style={styles.imageViewerContent}>
                  <Image
                    source={{ uri: currentImage }}
                    style={styles.fullScreenImage}
                    resizeMode="contain"
                  />

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setImageViewerVisible(false)}
                  >
                    <AntDesign name="closecircle" size={30} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </BlurView>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  detailContainer: {
    flex: 1,
    paddingTop: 15,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: "center",
  },
  backButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerAnimation: {
    width: 160,
    height: 160,
    marginBottom: 5,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  statsOverview: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  statItemLarge: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.2)",
    paddingRight: 15,
  },
  statsRow: {
    flex: 0.6,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingLeft: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  statValueSmall: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  statLabelSmall: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  correctCard: {
    borderLeftWidth: 6,
    borderLeftColor: Colors.light.success,
  },
  incorrectCard: {
    borderLeftWidth: 6,
    borderLeftColor: Colors.light.error,
  },
  expandedCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  questionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  questionHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginLeft: 10,
  },
  questionDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  questionText: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 15,
    lineHeight: 22,
  },
  questionImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
    marginBottom: 15,
  },
  answerSection: {
    marginTop: 5,
    marginBottom: 15,
  },
  answersSectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 10,
  },
  answerRow: {
    flexDirection: "row",
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "rgba(0, 150, 136, 0.08)",
    overflow: "hidden",
  },
  wrongAnswerRow: {
    backgroundColor: "rgba(239, 83, 80, 0.08)",
  },
  correctAnswerRow: {
    backgroundColor: "rgba(0, 150, 136, 0.08)",
  },
  answerIconContainer: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  answerTextContainer: {
    flex: 1,
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0, 0, 0, 0.05)",
  },
  answerLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  answerText: {
    fontSize: 15,
    fontWeight: "500",
  },
  correctAnswerText: {
    color: Colors.light.success,
  },
  wrongAnswerText: {
    color: Colors.light.error,
  },
  answerImageContainer: {
    marginBottom: 15,
  },
  answerImageTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 10,
  },
  answerImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  imageOverlayText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  explanationContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 12,
    padding: 12,
  },
  explanationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 5,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  spacer: {
    height: 60,
  },
  actionsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  backButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageViewerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewerBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewerContent: {
    width: "100%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: width * 0.9,
    height: height * 0.7,
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
})

export default ResultDetailScreen
