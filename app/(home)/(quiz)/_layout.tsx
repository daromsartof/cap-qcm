import { Stack } from "expo-router"
import { StyleSheet } from "react-native"
import React from "react"
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" />
      <Stack.Screen name="train" />
      <Stack.Screen name="qcm" />
      <Stack.Screen name="quiz" />
    </Stack>
  )
}

const styles = StyleSheet.create({})
