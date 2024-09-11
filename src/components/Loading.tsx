import { StyleSheet, View, Animated, StatusBar } from "react-native";
import React, { useRef } from "react";
import { useEffect} from "react";

import * as colors from "src/styles";

export default function Loading() {
    const opacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                
            ])
        ).start();
    }, []);
  
  return (
    <Animated.View style={[styles.page, {opacity:opacity}]}>
        <View style={styles.loadingShort}></View>
        <View style={styles.loadingLong}></View>
        <View style={styles.loadingLong}></View>
        <View style={styles.loadingShort}></View>
        <View style={styles.padding}></View>
        <View style={styles.loadingShort}></View>
        <View style={styles.loadingLong}></View>
        <View style={styles.loadingLong}></View>
        <View style={styles.loadingShort}></View>
        <View style={styles.padding}></View>
        <View style={styles.loadingShort}></View>
        <View style={styles.loadingLong}></View>
        <View style={styles.loadingLong}></View>
        <View style={styles.loadingShort}></View>
        <View style={styles.padding}></View>
        <View style={styles.loadingShort}></View>
        <View style={styles.loadingLong}></View>
        <View style={styles.loadingLong}></View>
        <View style={styles.loadingShort}></View>
        <View style={styles.padding}></View>
        <View style={styles.loadingShort}></View>
        <View style={styles.loadingLong}></View>
        <View style={styles.loadingLong}></View>
        <View style={styles.loadingShort}></View>
        <View style={styles.padding}></View>
    </Animated.View>
  );
}

export function LoadingView(props: {style?}) {
    const lowestOpacity = 0.1
    const opacity = useRef(new Animated.Value(lowestOpacity)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: lowestOpacity,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: lowestOpacity,
                    duration: 400,
                    useNativeDriver: true,
                }),
                
            ])
        ).start();
    }, []);
    return <Animated.View style={[{opacity:opacity}, props.style]}></Animated.View>

}


const styles = StyleSheet.create({
    page:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        marginTop: colors.TOP_BAR_HEIGHT + StatusBar.currentHeight,
    },
    loadingShort:{
        backgroundColor: colors.BACKGROUND_HIGHLIGHT,
        width:"60%",
        height: 20,
        margin: 10,
        borderRadius: 10,
    },
    loadingLong:{
        backgroundColor: colors.BACKGROUND_HIGHLIGHT,
        width:"90%",
        height: 20,
        margin: 10,
        borderRadius: 10,
    },
    padding:{
        margin: 5,
    }
});