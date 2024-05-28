import { StyleSheet, View, Text, Image, Animated } from "react-native";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import * as colors from "../styles";
import UserData from "../data/UserData";

export default function Loading() {
    const opacity = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1000,
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
    </Animated.View>
  );

}


const styles = StyleSheet.create({
    page:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        marginTop: colors.TOP_BAR_HEIGHT+60
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
        margin: 10,
    }
});