import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT } from '../styles';

export default function Settings(){
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Thanks for downloading, and supporting me!</Text>
        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        marginHorizontal: 10,
    },
    text: {
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
    },
})