
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { ThemedText as Text } from "@/components/ThemedText"
export default function RootLayout() {

    return (
      <Stack>
        <Stack.Screen name="(quiz)"  options={{
            headerShown: false
        }}/>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "",
            headerRight: () => (
              <View style={styles.headerIcons}>
                <Text style={styles.headerIconText}>3</Text>
                <FontAwesome name="question-circle" size={24} color="#6D4C41" />
              </View>
            ),
            headerLeft: () => <></>,
            headerTitleStyle: { color: "#6D4C41" },
            headerStyle: { backgroundColor: "white" },
          }}
        />
      </Stack>
    )
}

const styles = StyleSheet.create({
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    headerIconText: {
        color: '#6D4C41',
        fontSize: 18,
        marginRight: 8,
    },
})