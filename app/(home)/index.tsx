import HalfBgContainer from '@/components/HalfBgContainer';
import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText as Text } from "@/components/ThemedText"
const HomeScreen = () => {
    const [selectedRole, setSelectedRole] = useState('Agent');

    return (
        <HalfBgContainer>
            <View style={styles.container}>
                <View style={{
                    alignItems: "center"
                }}>
                    <Text style={styles.title}>CAP QCM</Text>
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                selectedRole === 'Agent' && styles.selectedButton,
                            ]}
                            onPress={() => setSelectedRole('Agent')}
                        >
                            <Text style={styles.toggleText}>Agent</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                selectedRole === 'Contrôleur' && styles.selectedButton,
                            ]}
                            onPress={() => setSelectedRole('Contrôleur')}
                        >
                            <Text style={styles.toggleText}>Contrôleur</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    width: "100%",
                    alignItems: "center"
                }}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Valider</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </HalfBgContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "space-around",
    },
    title: {
        fontSize: 40,
        color: Colors.light.bgPrimary,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    toggleButton: {
        backgroundColor: '#8B6A4F',
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: "40%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginHorizontal: 5,
    },
    selectedButton: {
        backgroundColor: '#6D4C41',
    },
    toggleText: {
        color: 'white',
        fontSize: 20,
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
    }
});
export default HomeScreen  