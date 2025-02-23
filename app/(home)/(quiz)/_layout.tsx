import { Stack } from "expo-router"
import { StyleSheet } from "react-native"
import React from "react"
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="train"
        options={{
          title: "Entrainement",
        }}
      />
      <Stack.Screen
        name="qcm"
        options={{
          title: "",
        }}
      />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="result" options={{
        headerShown: false
      }} />
       <Stack.Screen name="result-detail" options={{
        headerShown: false
      }} />
    </Stack>
  )
}

const styles = StyleSheet.create({})
