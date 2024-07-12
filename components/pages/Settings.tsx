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
            <Text style={styles.subtext}>Note that right now, if you reload it too many times, the app will stop working when you hit the API limit. </Text>
            <Text style={styles.subtext}>I'm working on a fix for this, but for now, just wait one hour before trying again. </Text>
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
    subtext: {
        fontSize: 16,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: "left",
        marginLeft: 10,
    },
    emoji:{
        fontSize: 50,
        width: "100%",
        textAlign: "center",

    }
})