import { StyleSheet, View, Text, ScrollView } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import LaunchInfo from "../styled/LaunchInfo";

import * as colors from "../styles";

export default function Tags(props){
    const userData = props.userData;
    return (
        <View style={props.shown?styles.tagsPage:styles.tagsPageHidden}>
            <ScrollView>
                <View style={styles.topPadding}></View>
                <Text style={styles.tagSectionTitle}>Tags</Text>
                <View style={styles.tagSection}>
                    <Tag name={"SpaceX"} selected={false}/>
                    <Tag name={"NASA"} selected={true}/>
                    <Tag name={"ULA"} selected={true}/>
                    <Tag name={"Ariane"} selected={true}/>
                    <Tag name={"ISRO"} selected={true}/>
                </View>
            </ScrollView>
        </View>
    )
}

function Tag(props){
    return (
        <View style={props.selected?styles.tagSelected:styles.tag}>
            <Text style={styles.tagText}>{props.name}</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    tagsPage: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        
        position: "absolute",
        top: 0,
        left: "0%",
        width: "100%",
        height: "100%",

        backgroundColor: colors.BACKGROUND,
        zIndex: 100,
    },
    tagsPageHidden: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        
        position: "absolute",
        top: 0,
        left: "-100%",
        width: "100%",
        height: "100%",

        backgroundColor: colors.BACKGROUND,
        zIndex: 100,
    },
    topPadding:{
        height: 60,
        width: "100%",
        backgroundColor: colors.BACKGROUND,
    
    },
    tagSection:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,

        backgroundColor: colors.BACKGROUND,
        zIndex: 100,
    },
    tagSectionTitle:{
        fontSize: 32,
        color: colors.FOREGROUND,
        fontFamily: colors.FONT,
    },
    tag: {
        backgroundColor: colors.FOREGROUND,
        color: colors.BACKGROUND,
        

        maxWidth: "50%",
        padding: 8,
        paddingHorizontal: 16,
        borderRadius: 100,
        margin: 10,

        alignContent: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    tagSelected:{
        backgroundColor: colors.ACCENT,
        color: colors.FOREGROUND,

        display: "flex",
        

        maxWidth: "50%",
        padding: 8,
        paddingHorizontal: 16,
        borderRadius: 100,
        margin: 10,

        alignContent: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    tagText:{
        fontFamily: colors.FONT,
        color: colors.BACKGROUND,
        fontSize: 24,
    }

})