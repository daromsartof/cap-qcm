import { Colors } from '@/constants/Colors'
import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'

const FullBgContainer = ({
    children
}: any) => {
    return (
        <SafeAreaView style={styles.container}>
            {children}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.bgPrimary,
        alignItems: 'center',
        justifyContent: 'center'
    },
})
export default FullBgContainer