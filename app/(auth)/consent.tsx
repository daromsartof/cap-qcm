import FullBgContainer from '@/components/FullBgContainer';
import { Link } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ConsentScreen = () => {
  return (
    <FullBgContainer style={styles.container}>
      <Text style={styles.title}>CAP QCM</Text>
      <Text style={styles.description}>
        Cap-qcm veille au respect de la protection des données de l'utilisateur et{' '}
        <Text style={styles.boldText}>n'utilise QU’UN SEUL COOKIE de suivi d’activité.</Text>{'\n'}
        Aucun cookie d’identification n’est utilisé.{'\n\n'}
        Pour votre inscription, <Text style={styles.boldText}>n'utilisez donc AUCUNE information vous concernant</Text>
        (nom, prénom, surnom, age, sexe, localisation...) et <Text style={styles.boldText}>n'utilisez pas</Text> une
        adresse mail permettant de vous identifier (nom.prénom@nomdedomaine), ni une adresse mail personnelle
        habituelle, ni une adresse mail professionnelle.{'\n\n'}
        Un compte créé avec des informations qui permettraient de vous identifier sera clôturé.
      </Text>
      <TouchableOpacity style={styles.buttonAgree}>
        <Link style={styles.buttonText} href={"/(auth)/singup"}>J’ai compris et je suis d’accord</Link>
      </TouchableOpacity>
      <View style={styles.buttonDisagree}>
        <Text style={styles.buttonText}>Je ne suis pas d’accord</Text>
      </View>
    </FullBgContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: 'white',
    textAlign: 'justify',
    marginBottom: 30,
    marginHorizontal: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonAgree: {
    width: '80%',
    backgroundColor: '#8B6A4F',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonDisagree: {
    width: '80%',
    backgroundColor: '#A07855',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ConsentScreen;