import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const HalfBgContainer = ({
    children
}: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}></View>
            <View style={styles.footer}>
            </View>
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.bgPrimary,
        position: "relative"
    },
    header: {
        position: "absolute",
        width: "100%",
        height: "60%",
        backgroundColor: "white",
        top: 0,
        left: 0,
        right: 0,
        borderBottomRightRadius: 200,
        borderBottomLeftRadius: 10,
    },
    footer: {
        position: "absolute",
        width: "100%",
        height: "40%",
        bottom: 0,
        left: 0
    },
});

export default HalfBgContainer;