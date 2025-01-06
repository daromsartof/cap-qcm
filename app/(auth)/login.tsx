import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import HalfBgContainer from '@/components/HalfBgContainer';
import { Link } from 'expo-router';
import { ThemedText as Text } from "@/components/ThemedText"
const LoginScreen = () => {
    return (
      <HalfBgContainer>
        <View style={styles.header}>
          <Text style={styles.title}>CAP QCM</Text>
          <FontAwesome
            name="bars"
            size={24}
            color="#6D4C41"
            style={styles.menuIcon}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.button}>
            <Link style={styles.buttonText} href={"/(singin)"}>
              <Text>Connexion</Text>
            </Link>
          </View>
          <View style={styles.button}>
            <Link style={styles.buttonText} href={"/(auth)/consent"}>
              <Text>Inscription</Text>
            </Link>
          </View>
        </View>
      </HalfBgContainer>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.bgPrimary,
    },
    header: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    title: {
        fontSize: 40,
        color: Colors.light.bgPrimary,
        fontWeight: 'bold',
    },
    menuIcon: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    footer: {
        flex: 1,
        borderTopLeftRadius: 100,
        paddingVertical: 40,
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
        color: Colors.light.bgPrimary,
        fontSize: 16,
    },
});

export default LoginScreen;