import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import FullBgContainer from '@/components/FullBgContainer';
import { Link } from 'expo-router';
import { ThemedText as Text } from "@/components/ThemedText"
import { useAuth } from '@/contexts/AutContext';
import { ActivityIndicator } from 'react-native-paper';
import { useToast } from '@/hooks/useToast';
import { sendVerificationEmail } from '@/services/auth.service';
const ConnectionCodeScreen = () => {
    const [isConnected, setIsConnected] = useState(true)
    const [code, setCode] = useState("")
     const toast = useToast()
    const [loading, setLoading] = useState(false)
    const { verifyCode, email } = useAuth()
    const toggleSwitch = () => setIsConnected(previousState => !previousState)

    const handleValider = async () => {
      try {
        setLoading(true)
        await verifyCode(code, isConnected)
      } catch (error: any) {
        toast.error("Error", error.error || error.message)
      } finally {
        setLoading(false)
      }
    }

    const handleResend = async () => {
      try {
        await sendVerificationEmail({ email })
        toast.success(
          'Success',
          'Code de connexion renvoyé'
        )
      } catch (error: any) {
        toast.error("Error", error.error || error.message)
      }
    }
    return (
      <FullBgContainer>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>CAP QCM</Text>
          </View>
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>
              Code de connexion reçu par e-mail:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez le code ici"
              placeholderTextColor="#D7CCC8"
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={{
            marginBottom: 20,
            width: "100%",
            alignItems: "flex-end"
          }} onPress={handleResend}>
            <Text>
              Code non Reçue <Text style={{
                color: 'green'
              }}>Renvoyé</Text>
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 0.4,
            }}
          >
            <View style={styles.switchContainer}>
              <FontAwesome
                name={isConnected ? "check-square" : "square-o"}
                size={24}
                color="white"
              />
              <Text style={styles.switchText}>Restez connecté(e)</Text>
              <Switch
                value={isConnected}
                onValueChange={toggleSwitch}
                thumbColor="white"
                trackColor={{ false: "#8B6A4F", true: "#8B6A4F" }}
                // style={styles.switch}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleValider}>
            <Text style={styles.buttonText}>
              {loading ? <ActivityIndicator size={"small"} /> : "Valider"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </FullBgContainer>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        padding: 20,
        alignItems: 'center'
    },
    header: {
        flex: 0.4,
        alignItems: 'center',
        justifyContent: "center",
    },
    title: {
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    codeContainer: {
        backgroundColor: '#8B6A4F',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        marginBottom: 10,
    },
    codeText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#5D4037',
        color: 'white',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8B6A4F',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
        width: '100%',
    },
    switchText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
        flex: 1,
    },
    button: {
        width: '80%',
        backgroundColor: 'white',
        paddingVertical: 12,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#6D4C41',
        fontSize: 16,
    },
});

export default ConnectionCodeScreen;