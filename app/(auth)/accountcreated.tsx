import FullBgContainer from '@/components/FullBgContainer';
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText as Text} from '@/components/ThemedText'
import { useSearchParams } from 'expo-router/build/hooks'
import { router } from "expo-router"

const AccountCreatedScreen = () => {
  const params = useSearchParams()
  
  const handleClick = () => {
    router.push('/(auth)/(singin)')
  }
  
  return (
    <FullBgContainer style={styles.container}>
      <Text style={styles.title}>CAP QCM</Text>

      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Bonjour {""} !</Text>
        <Text style={styles.messageText}>Votre compte est créé.</Text>
        <Text style={styles.messageText}>
          Pour vous connecter, et à chaque connexion, un code
          <Text style={styles.boldText}>de sécurité vous sera</Text>
          envoyé sur l’adresse mail {""} que vous avez indiqué.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <Text style={styles.buttonText}>Retour à l’accueil</Text>
      </TouchableOpacity>
    </FullBgContainer>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  messageContainer: {
    flex: 0.7,
    backgroundColor: '#8B6A4F',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
    width: '90%',
  },
  messageText: {
    color: 'white',
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'justify',
  },
  boldText: {
    fontWeight: 'bold',
  },
  button: {
    width: '60%',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#6D4C41',
    fontSize: 16,
  },
});

export default AccountCreatedScreen;