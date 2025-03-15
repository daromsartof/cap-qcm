import HalfBgContainer from "@/components/HalfBgContainer"
import { Colors } from "@/constants/Colors"
import React, { useEffect, useState } from "react"
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated as RNAnimated,
  ScrollView,
} from "react-native"
import { ThemedText as Text } from "@/components/ThemedText"
import { Categorie } from "@/types/Categorie"
import { getAllCategories } from "@/services/categorie.service"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "@/contexts/AutContext"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  FadeOut,
} from "react-native-reanimated"

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const router = useRouter()
  const [categories, setCategories] = useState<Categorie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scaleValue = new RNAnimated.Value(1)
  const { logout } = useAuth()

  // Animation values for loader
  const rotation = useSharedValue(0)
  const scale1 = useSharedValue(0)
  const scale2 = useSharedValue(0)
  const scale3 = useSharedValue(0)
  const opacity1 = useSharedValue(0)
  const opacity2 = useSharedValue(0)
  const opacity3 = useSharedValue(0)

  const handleFetchCategories = async () => {
    setIsLoading(true)
    try {
      const categories = await getAllCategories()
      setCategories(categories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleFetchCategories()
  }, [])

  // Loader animations
  useEffect(() => {
    if (isLoading) {
      // Rotate the main loader
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1500,
          easing: Easing.linear,
        }),
        -1, // infinite
        false
      )

      // Animate the pulsing dots with staggered timing
      const animateDot = (scale, opacity, delay) => {
        scale.value = 0
        opacity.value = 0

        scale.value = withDelay(
          delay,
          withRepeat(
            withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
            -1,
            true
          )
        )

        opacity.value = withDelay(
          delay,
          withRepeat(
            withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
            -1,
            true
          )
        )
      }

      animateDot(scale1, opacity1, 0)
      animateDot(scale2, opacity2, 200)
      animateDot(scale3, opacity3, 400)
    }
  }, [isLoading])

  const handlePressIn = () => {
    RNAnimated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    RNAnimated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  // Animated styles for loader
  const spinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    }
  })

  const dot1Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale1.value }],
      opacity: opacity1.value,
    }
  })

  const dot2Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale2.value }],
      opacity: opacity2.value,
    }
  })

  const dot3Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale3.value }],
      opacity: opacity3.value,
    }
  })

  return (
    <HalfBgContainer>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Animated.View style={[styles.spinner, spinnerStyle]}>
            <MaterialIcons
              name="school"
              size={50}
              color={Colors.light.bgPrimary}
            />
          </Animated.View>

          <Text style={styles.loadingText}>Chargement des catégories</Text>

          <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, dot1Style]} />
            <Animated.View style={[styles.dot, dot2Style]} />
            <Animated.View style={[styles.dot, dot3Style]} />
          </View>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.header}>
              <LinearGradient
                colors={[Colors.light.bgPrimary, Colors.light.active]}
                style={styles.titleContainer}
              >
                <Text style={styles.title}>CAP QCM</Text>
                <Text style={styles.subtitle}>Maîtrisez vos examens</Text>
              </LinearGradient>
              <MaterialIcons
                name="school"
                size={40}
                color="white"
                style={styles.icon}
              />
            </View>

            <View style={styles.content}>
              <Text style={styles.sectionTitle}>
                Choisissez votre catégorie
              </Text>
              <View style={styles.gridContainer}>
                {categories.map((categorie) => (
                  <RNAnimated.View
                    key={categorie.id}
                    style={{ transform: [{ scale: scaleValue }] }}
                  >
                    <TouchableOpacity
                      style={styles.categoryCard}
                      onPressIn={handlePressIn}
                      onPressOut={handlePressOut}
                      onPress={() => {
                        router.push({
                          pathname: "/(home)/(quiz)/home",
                          params: { categorie: JSON.stringify(categorie) },
                        })
                      }}
                    >
                      <LinearGradient
                        colors={[Colors.light.active, Colors.light.bgPrimary]}
                        style={styles.gradient}
                      >
                        <MaterialIcons
                          name="library-books"
                          size={28}
                          color="white"
                        />
                        <Text style={styles.categoryTitle}>
                          {categorie.title}
                        </Text>
                        <Text style={styles.questionCount}>
                          {categorie._count.questions} Questions
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </RNAnimated.View>
                ))}
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Progression quotidienne : 75 %
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "75%" }]} />
              </View>
            </View>
            <View
              style={{
                padding: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={logout}
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  padding: 10,
                  elevation: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: Colors.light.bgPrimary,
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  <MaterialIcons
                    name="logout"
                    size={28}
                    color={Colors.light.bgPrimary}
                  />
                </Text>
                <Text
                  style={[
                    styles.questionCount,
                    {
                      color: Colors.light.bgPrimary,
                    },
                  ]}
                >
                  Se déconnecter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </HalfBgContainer>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.light.bgPrimary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  titleContainer: {
    padding: 15,
    borderRadius: 20,
  },
  title: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    marginTop: 4,
  },
  icon: {
    marginRight: 15,
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    color: Colors.light.bgPrimary,
    fontWeight: "600",
    marginBottom: 25,
    textAlign: "center",
  },
  gridContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  categoryCard: {
    height: 160,
    marginBottom: 15,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  categoryTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  questionCount: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 25,
    marginTop: 30,
  },
  footerText: {
    color: Colors.light.background,
    fontSize: 16,
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    borderColor: Colors.light.background,
    borderWidth: 1,
    backgroundColor: Colors.light.active,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.background,
    borderRadius: 4,
  },

  // New loader styles
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  spinner: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.light.bgPrimary,
    fontWeight: "600",
    marginBottom: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.bgPrimary,
    marginHorizontal: 5,
  },
})

export default HomeScreen
