import FullBgContainer from '@/components/FullBgContainer';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withDelay, withRepeat } from 'react-native-reanimated';
import { Link, useRouter } from 'expo-router';
import { ThemedText as Text } from "@/components/ThemedText"
import * as SecureStore from "expo-secure-store"

const WelcomeComponent = () => {
    const iconOpacity1 = useSharedValue(0);
    const iconOpacity2 = useSharedValue(0);
    const iconOpacity3 = useSharedValue(0);
  
    useEffect(() => {
      iconOpacity1.value = withRepeat(withDelay(0, withTiming(1000)), 3, true);
      iconOpacity2.value = withRepeat(withDelay(3000, withTiming(1000)), 3, true);
      iconOpacity3.value = withRepeat(withDelay(6000, withTiming(1000)), 3, true);
    }, []);
  
    const animatedStyle1 = useAnimatedStyle(() => ({
      opacity: iconOpacity1.value,
    }));
  
    const animatedStyle2 = useAnimatedStyle(() => ({
      opacity: iconOpacity2.value,
    }));
  
    const animatedStyle3 = useAnimatedStyle(() => ({
      opacity: iconOpacity3.value,
    }));
   const router = useRouter()

   useEffect(() => {
     const timer = setTimeout(() => {
        const checkAuth = async () => {
              const token = await SecureStore.getItemAsync("userToken")
              console.log("here is token", token)
              
              if(!!token) {
                router.push("/(home)")
              } else {
                
                router.push("/(auth)/login")
              }
            }
        
            checkAuth()
     }, 6000)

     return () => clearTimeout(timer)
   }, [router])
    return (
        <FullBgContainer>
            <View style={styles.container}>
                <View style={{
                    flex: 0.5,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={styles.title}>CAP QCM</Text>
                </View>
                <View>
                    <Text style={styles.description}>
                        Maîtrisez l’épreuve du QCM aux concours :{'\n'}
                        révisez facilement{'\n'}
                        <Text style={styles.highlight}>partout, à n’importe quel moment</Text>
                    </Text>
                    <View style={styles.iconContainer}>
                        <Animated.View style={[styles.iconBackground, animatedStyle1]}>
                            <FontAwesome name="bed" size={40} color="#D7CCC8" />
                        </Animated.View>
                        <Animated.View style={[styles.iconBackground, animatedStyle2]}>
                            <FontAwesome name="comment" size={40} color="#D7CCC8" />
                        </Animated.View>
                        <Animated.View style={[styles.iconBackground, animatedStyle3]}>
                            <FontAwesome name="plane" size={40} color="#D7CCC8" />
                        </Animated.View>
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
        fontSize: 50,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 30,
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
        position: 'relative',
        backgroundColor: "green"
    },
    iconBackground: {
        width: 150,
        position: "absolute",
        top: 0,
        height: 150,
        backgroundColor: '#5D4037', // Darker brown for the icon background
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 30,
        color: '#D7CCC8', // Light brown color for the icon text
    },
});

export default WelcomeComponent;