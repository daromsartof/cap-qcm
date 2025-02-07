import HalfBgContainer from "@/components/HalfBgContainer"
import { Colors } from "@/constants/Colors"
import React, { useEffect, useState } from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { ThemedText as Text } from "@/components/ThemedText"
import { Categorie } from "@/types/Categorie"
import { getAllCategories } from "@/services/categorie.service"
const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [categories, setCategories] = useState<Categorie[]>([])
    const handleFetchCategories = async () => {
        const categories = await getAllCategories()
        setCategories(categories)
    }
    useEffect(() => {
        handleFetchCategories()
    }, [])
  return (
    <HalfBgContainer>
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>CAP QCM</Text>
          <View style={styles.toggleContainer}>
            {categories.map((categorie) => (
                <TouchableOpacity
                  key={categorie.id}
                  style={[
                    styles.toggleButton,
                    categorie.id === selectedCategory && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedCategory(categorie.id)}
                >
                  <Text style={styles.toggleText}>{categorie.title}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>

        <View
          style={{
            width: "100%",
            alignItems: "center",
          }}
        ></View>
      </View>
    </HalfBgContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 40,
    color: Colors.light.bgPrimary,
    fontWeight: "bold",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  toggleButton: {
    backgroundColor: "#8B6A4F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 15,
  },
  selectedButton: {
    backgroundColor: "#6D4C41",
  },
  toggleText: {
    color: "white",
    fontSize: 20,
  },
  button: {
    width: "60%",
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#6D4C41",
    fontSize: 16,
  },
})
export default HomeScreen
