import HalfBgContainer from "@/components/HalfBgContainer"
import { Colors } from "@/constants/Colors"
import React, { useEffect, useState } from "react"
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native"
import { ThemedText as Text } from "@/components/ThemedText"
import { Categorie } from "@/types/Categorie"
import { getAllCategories } from "@/services/categorie.service"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialIcons } from "@expo/vector-icons"

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const router = useRouter()
  const [categories, setCategories] = useState<Categorie[]>([])
  const scaleValue = new Animated.Value(1)

  const handleFetchCategories = async () => {
    const categories = await getAllCategories()
    setCategories(categories)
  }

  useEffect(() => {
    handleFetchCategories()
  }, [])

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  return (
    <HalfBgContainer>
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
          <Text style={styles.sectionTitle}>Choisissez votre catégorie</Text>
          <View style={styles.gridContainer}>
            {categories.map((categorie) => (
              <Animated.View
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
                    <Text style={styles.categoryTitle}>{categorie.title}</Text>
                    <Text style={styles.questionCount}>120 Questions</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Progression quotidienne : 75 %</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "75%" }]} />
          </View>
        </View>
      </View>
    </HalfBgContainer>
  )
}

const styles = StyleSheet.create({
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
    flexDirection: 'column',
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
})

export default HomeScreen
