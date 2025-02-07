import HalfBgContainer from "@/components/HalfBgContainer"
import { Colors } from "@/constants/Colors"
import React from "react"
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native"
import { ThemedText as Text } from "@/components/ThemedText"
import { Link, useLocalSearchParams, useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialIcons } from "@expo/vector-icons"
import { ProgressBar } from "react-native-paper"

const HomeQuizScreen = () => {
  const { categorie } = useLocalSearchParams<{
    categorie: string
  }>()
  const categorieData = categorie ? JSON.parse(categorie) : {}
  const scaleValue = new Animated.Value(1)
  const router = useRouter()
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
        {/* Header Section */}
        <LinearGradient
          colors={[Colors.light.bgPrimary, Colors.light.active]}
          style={styles.header}
        >
          <Text style={styles.title}>CAP QCM</Text>
          <View style={styles.categoryBadge}>
            <MaterialIcons name="category" size={24} color="white" />
            <Text style={styles.categoryText}>{categorieData.title}</Text>
          </View>
        </LinearGradient>

        {/* Progress Section */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Votre progression</Text>
          <ProgressBar
            progress={0.65}
            color={Colors.light.active}
            style={styles.progressBar}
          />
          <Text style={styles.statsText}>65% terminé • 120 questions</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPress={() => {
                router.push({
                  pathname: "/(home)/(quiz)/train",
                })
              }}
              onPressOut={handlePressOut}
            >
              <LinearGradient
                colors={[Colors.light.active, Colors.light.bgPrimary]}
                style={[styles.button, styles.shadow]}
              >
                <MaterialIcons name="library-books" size={28} color="white" />
                <Text style={styles.buttonTitle}>Entrainement</Text>
                <Text style={styles.buttonSubtitle}>
                  Mode entraînement • Tentatives illimitées
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <LinearGradient
                colors={[Colors.light.active, Colors.light.bgPrimary]}
                style={[styles.button, styles.shadow]}
              >
                <MaterialIcons name="whatshot" size={28} color="white" />
                <Text style={styles.buttonTitle}>Defi du jour</Text>
                <Text style={styles.buttonSubtitle}>
                  Défi quotidien • Limite de 24h
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Taux de réussite</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Complété</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Traînée</Text>
          </View>
        </View>
      </View>
    </HalfBgContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  title: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  categoryText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "600",
  },
  progressContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    elevation: 6,
  },
  progressText: {
    color: Colors.light.bgPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.inactive,
  },
  statsText: {
    color: Colors.light.text,
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 25,
  },
  button: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  buttonSubtitle: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
    textAlign: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    elevation: 6,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: Colors.light.bgPrimary,
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: Colors.light.text,
    fontSize: 14,
    marginTop: 5,
  },
})

export default HomeQuizScreen
