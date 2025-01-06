import FullBgContainer from '@/components/FullBgContainer';
import { useRouter } from "expo-router"
import React, { useEffect } from 'react';
import { View, StyleSheet, Touchable } from 'react-native';
import { ThemedText as Text } from "@/components/ThemedText"
import {  } from "expo-router"
const WelcomeComponent = () => {
    
   const router = useRouter()

   useEffect(() => {
     const timer = setTimeout(() => {
       router.push('/(auth)/login') 
     }, 3000) 

     return () => clearTimeout(timer) 
   }, [router])
    return (
        <FullBgContainer>
            <View style={styles.container}>
                <Text style={styles.title}>CAP QCM</Text>
                <Text style={styles.description}>
                    Maîtrisez l’épreuve du QCM aux concours :{'\n'}
                    révisez facilement{'\n'}
                    <Text style={styles.highlight}>partout, à n’importe quel moment</Text>
                </Text>
                <View style={styles.iconContainer}>
                    <View style={styles.iconBackground}>
                        <Text style={styles.iconText}>😴</Text> {/* Icon representing the sleeping figure */}
                    </View>
                </View>
            </View>
        </FullBgContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 30,
    },
    highlight: {
        fontWeight: 'bold',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBackground: {
        width: 60,
        height: 60,
        backgroundColor: '#5D4037', // Darker brown for the icon background
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 24,
        color: '#D7CCC8', // Light brown color for the icon text
    },
});

export default WelcomeComponent;