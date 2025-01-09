import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { BaseToast, ErrorToast, InfoToast } from "react-native-toast-message"
import type { BaseToastProps } from "react-native-toast-message"

interface CustomToastProps extends BaseToastProps {
  text1: string
  text2?: string
}

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),

  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),

  info: (props: BaseToastProps) => (
    <InfoToast
      {...props}
      style={styles.infoToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  )
}

const styles = StyleSheet.create({
  successToast: {
    borderLeftColor: "#00C851",
    backgroundColor: "#ffffff",
  },
  errorToast: {
    borderLeftColor: "#ff4444",
    backgroundColor: "#ffffff",
  },
  infoToast: {
    borderLeftColor: "#33b5e5",
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  text1: {
    fontSize: 16,
    fontWeight: "600",
  },
  text2: {
    fontSize: 14,
  },
  customToast: {
    width: "90%",
    backgroundColor: "#333333",
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 20,
    flexDirection: "column",
  },
  customText1: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  customText2: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 5,
  },
})
