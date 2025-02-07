import { Stack } from "expo-router"
import { StyleSheet } from "react-native"
import React from "react"
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="quiz" />
    </Stack>
  )
}

const styles = StyleSheet.create({})
