import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT } from '../styles';

export default function Settings(){
    return (
        <View style={styles.container}>
            <Text style={styles.text}></Text>
            <Text style={styles.text}>Nothing here yet...</Text>
            <Text style={styles.emoji}></Text>
            <Text style={styles.emoji}>🏗️🧱🧱🧱🕳️</Text>
            <Text style={styles.emoji}>👷🚧🚧🚧👷‍♀️</Text>
            <Text style={styles.emoji}>🚚🧱🧱🧱🧰</Text>
            <Text style={styles.emoji}></Text>
            <Text style={styles.text}>Thanks for downloading, and supporting me!</Text>
            <Text style={styles.text}></Text>
        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        zIndex: 100,
        marginTop: StatusBar.currentHeight+ TOP_BAR_HEIGHT,
        marginBottom: BOTTOM_BAR_HEIGHT+20,
        marginHorizontal: 10,
        // backgroundColor: COLORS.BACKGROUND,
    },
    text: {
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: "center",
    },
    emoji:{
        fontSize: 50,
        width: "100%",
        textAlign: "center",

    }
})