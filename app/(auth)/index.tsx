import FullBgContainer from "@/components/FullBgContainer"
import React, { useEffect, useState, useRef } from "react"
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  FadeIn,
  SlideInRight,
} from "react-native-reanimated"
import { useRouter } from "expo-router"
import { ThemedText as Text } from "@/components/ThemedText"
import * as SecureStore from "expo-secure-store"

const { width, height } = Dimensions.get("window")
const iconSize = width * 0.25

// Slider content data
const sliderData = [
  {
    id: 1,
    title: "Apprenez à votre rythme",
    description:
      "Des milliers de questions pour vous entraîner quand vous voulez",
    image: require("@/assets/images/illustration-learn.png"), // Add these images to your assets folder
    color: "rgba(93, 64, 55, 0.85)",
  },
  {
    id: 2,
    title: "Suivez vos progrès",
    description: "Visualisez votre évolution et identifiez vos points faibles",
    image: require("@/assets/images/illustration-progress.png"),
    color: "rgba(93, 64, 55, 0.85)",
  },
  {
    id: 3,
    title: "Réussissez vos examens",
    description: "Préparez-vous efficacement pour le jour J",
    image: require("@/assets/images/illustration-success.png"),
    color: "rgba(93, 64, 55, 0.85)",
  },
]

const WelcomeComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const scrollViewRef = useRef(null)

  // Existing shared values
  const iconOpacity1 = useSharedValue(0)
  const iconOpacity2 = useSharedValue(0)
  const iconOpacity3 = useSharedValue(0)

  const iconScale1 = useSharedValue(0.8)
  const iconScale2 = useSharedValue(0.8)
  const iconScale3 = useSharedValue(0.8)

  const titleOpacity = useSharedValue(0)
  const titleTranslateY = useSharedValue(-20)

  const descriptionOpacity = useSharedValue(0)

  // Auto-scroll timer for slider
  useEffect(() => {
    console.log("currentSlide", currentSlide)

    const timer = setInterval(() => {
      const nextSlide = (currentSlide + 1) % sliderData.length
      setCurrentSlide(nextSlide)
      scrollViewRef.current?.scrollTo({ x: nextSlide * width, animated: true })
      if (nextSlide === sliderData.length - 1) {
        const checkAuth = async () => {
          const token = await SecureStore.getItemAsync("userToken")

          if (!!token) {
            router.replace("/(home)")
          } else {
            router.replace("/(auth)/login")
          }
        }

        checkAuth()
      }
    }, 5000)

    return () => {
      clearInterval(timer)
    }
  }, [currentSlide])

  // Existing animation setup
  useEffect(() => {
    // Animate title first
    titleOpacity.value = withTiming(1, { duration: 800 })
    titleTranslateY.value = withTiming(0, { duration: 800 })

    // Then description
    descriptionOpacity.value = withDelay(600, withTiming(1, { duration: 800 }))

    // Then icons with sequence
    const animateIcon = (
      opacity: Animated.SharedValue<number>,
      scale: Animated.SharedValue<number>,
      delay: number
    ) => {
      opacity.value = withDelay(delay, withTiming(1, { duration: 600 }))
      scale.value = withDelay(
        delay,
        withSequence(
          withTiming(1.1, { duration: 400, easing: Easing.out(Easing.back()) }),
          withTiming(1, { duration: 200 })
        )
      )
    }

    animateIcon(iconOpacity1, iconScale1, 1400)
    animateIcon(iconOpacity2, iconScale2, 1800)
    animateIcon(iconOpacity3, iconScale3, 2200)

    // Add subtle pulse animation after initial appearance
    const startPulse = () => {
      setTimeout(() => {
        iconScale1.value = withRepeat(
          withSequence(
            withTiming(1.05, { duration: 1000 }),
            withTiming(1, { duration: 1000 })
          ),
          -1, // infinite repeat
          true // reverse
        )

        iconScale2.value = withDelay(
          300,
          withRepeat(
            withSequence(
              withTiming(1.05, { duration: 1000 }),
              withTiming(1, { duration: 1000 })
            ),
            -1,
            true
          )
        )

        iconScale3.value = withDelay(
          600,
          withRepeat(
            withSequence(
              withTiming(1.05, { duration: 1000 }),
              withTiming(1, { duration: 1000 })
            ),
            -1,
            true
          )
        )
      }, 3000)
    }

    startPulse()
  }, [])

  // Existing animated styles
  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: iconOpacity1.value,
    transform: [{ scale: iconScale1.value }],
  }))

  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: iconOpacity2.value,
    transform: [{ scale: iconScale2.value }],
  }))

  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: iconOpacity3.value,
    transform: [{ scale: iconScale3.value }],
  }))

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }))

  const animatedDescriptionStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
  }))

  const router = useRouter()

  // Handle manual slide change
  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width)
    setCurrentSlide(slideIndex)
  }

  return (
    <FullBgContainer>
      <View style={styles.container}>
        <Animated.View style={[styles.titleContainer, animatedTitleStyle]}>
          <Text style={styles.title}>CAP QCM</Text>
        </Animated.View>

        <Animated.View
          style={[styles.descriptionContainer, animatedDescriptionStyle]}
        >
          <Text style={styles.description}>
            Maîtrisez l'épreuve du QCM aux concours :{"\n"}
            révisez facilement{"\n"}
            <Text style={styles.highlight}>
              partout, à n'importe quel moment
            </Text>
          </Text>

          {/* Slider Component */}
          <View style={styles.sliderContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
              style={styles.slider}
            >
              {sliderData.map((item, index) => (
                <Animated.View
                  key={item.id}
                  style={[styles.slide, { backgroundColor: item.color }]}
                  entering={SlideInRight.delay(index * 200)}
                >
                  <Image source={item.image} style={styles.slideImage} />
                  <Text style={styles.slideTitle}>{item.title}</Text>
                  <Text style={styles.slideDescription}>
                    {item.description}
                  </Text>
                </Animated.View>
              ))}
            </ScrollView>

            {/* Pagination dots */}
            <View style={styles.pagination}>
              {sliderData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentSlide === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.iconContainer}>
            <Animated.View style={[styles.iconBackground, animatedStyle1]}>
              <FontAwesome5
                name="book-reader"
                size={iconSize * 0.4}
                color="#FFFFFF"
              />
              <Text style={styles.iconText}>Apprenez</Text>
            </Animated.View>

            <Animated.View style={[styles.iconBackground, animatedStyle2]}>
              <FontAwesome5
                name="brain"
                size={iconSize * 0.4}
                color="#FFFFFF"
              />
              <Text style={styles.iconText}>Pratiquez</Text>
            </Animated.View>

            <Animated.View style={[styles.iconBackground, animatedStyle3]}>
              <FontAwesome5
                name="trophy"
                size={iconSize * 0.4}
                color="#FFFFFF"
              />
              <Text style={styles.iconText}>Réussissez</Text>
            </Animated.View>
          </View>

          {/* Skip button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.skipText}>Passer</Text>
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
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 50,
    color: "white",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 32,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 3,
  },
  highlight: {
    fontWeight: "bold",
    color: "#FFD700", // Gold color for emphasis
  },
  // Slider styles
  sliderContainer: {
    height: height * 0.4,
    marginBottom: 30,
  },
  slider: {
    width: width - 40, // Account for container padding
  },
  slide: {
    width: width - 40,
    height: height * 0.35,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  slideImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
    resizeMode: "contain",
  },
  slideTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  slideDescription: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "white",
    width: 12,
    height: 8,
  },
  // Icon styles
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  iconBackground: {
    width: iconSize,
    height: iconSize,
    backgroundColor: "rgba(93, 64, 55, 0.85)", // Semi-transparent brown
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 10,
  },
  iconText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 8,
    fontWeight: "600",
  },
  // Skip button
  skipButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  skipText: {
    color: "white",
    fontWeight: "600",
  },
})

export default WelcomeComponent
