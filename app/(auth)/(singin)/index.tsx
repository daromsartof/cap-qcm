import HalfBgContainer from '@/components/HalfBgContainer';
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText as Text } from "@/components/ThemedText"
import { useAuth } from '@/contexts/AutContext';
import { useToast } from '@/hooks/useToast';
const SinginScreen = () => {
    const [email, setEmail] = useState('')
    const [loading, setloading] = useState(false)
    const toast = useToast()
    const {
      login
    } = useAuth()
    const handlelogin = async () => {
      if (!email) {
        return toast.info('Please', 'Email is required')
      }
      try {
        setloading(true)
         await login(email)
      } catch (error) {
        console.log(error)
        
      } finally {
        setloading(false)
      }
     
    }

    return (
      <HalfBgContainer>
        <View
          style={{
            flex: 1,
          }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>CAP QCM</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#FFFFFF"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handlelogin}>
              <Text style={styles.buttonText}>{loading ? <ActivityIndicator  size={"small"} /> : "Valider"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </HalfBgContainer>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {
        color: 'white',
        fontSize: 16,
    },
    header: {
        flex: 0.4,
        alignItems: 'center',
        justifyContent: "flex-end",
    },
    title: {
        fontSize: 40,
        color: '#6D4C41',
        fontWeight: 'bold',
    },
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        width: '80%',
        backgroundColor: '#8B6A4F',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginVertical: 10,
    },
    inputLabel: {
        color: 'white',
        fontSize: 16,
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '60%',
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

export default SinginScreen;