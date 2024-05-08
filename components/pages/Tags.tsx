import { StyleSheet, View, Text, ScrollView, Animated} from "react-native";
import React, {useRef} from "react";
import { useEffect, useState } from "react";
import { GestureDetector, Gesture} from "react-native-gesture-handler";

import LaunchInfo from "../styled/LaunchInfo";

import * as colors from "../styles";
import { transform } from "typescript";

export default function Tags(props){
    const userData = props.userData;
    const tags = userData.getSystemTags();
    const tagState = userData.getTags();

    return (
        <View style={props.shown?styles.tagsPage:styles.tagsPageHidden}>
            <ScrollView>
                <View style={styles.topPadding}></View>
                <Text style={styles.tagSectionTitle}>Launch Providers</Text>
                <View style={styles.tagSection}>
                    {tags.launch_providers.map((tag) => {
                        return <Tag key={tag[0]} tag={tag} tagState={tagState.launchProviders}/>
                    })}
                </View>
                <Text style={styles.tagSectionTitle}>Rockets</Text>
            </ScrollView>
        </View>
    )
}

function Tag(props){
    let tagState = props.tagState;
    let tagID = props.tag[0];
    let name = props.tag[1];
    const [selected, setSelected] = useState(tagState.includes(tagID));
    
    // ANIMATIONS
    const scale = useRef(new Animated.Value(1)).current;

    
    let toggleTag = () => {
        if (selected){
            tagState.splice(tagState.indexOf(tagID),1);
            setSelected(false);
        }
        else{
            tagState.push(tagID);
            setSelected(true);
        }
        Animated.sequence([
            
        Animated.timing(scale, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true, // Add this to improve performance
        }),
        Animated.timing(scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true, // Add this to improve performance
        })
        ]).start();
    }

    let tap = Gesture.Tap();
    tap.onFinalize(()=>toggleTag());
    return (
        <GestureDetector gesture={tap} >
            <Animated.Text style={[selected?styles.tagSelected:styles.tag, {transform:[{scale}]}]}>{name}</Animated.Text>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    tagsPage: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        
        position: "absolute",
        top: 100,
        width: "100%",
        height: "100%",

        backgroundColor: colors.BACKGROUND,
        zIndex: 50,
        left: "0%",
    },
    tagsPageHidden: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",

        backgroundColor: colors.BACKGROUND,
        zIndex: 100,
        left: "-100%",
    },
    topPadding:{
        height: 60,
        width: "100%",
        backgroundColor: colors.BACKGROUND,
    
    },
    tagSection:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",

        padding: 10,

        backgroundColor: colors.BACKGROUND,
    },
    tagSectionTitle:{
        fontSize: 32,
        color: colors.FOREGROUND,
        fontFamily: colors.FONT,
        margin: 16,
    },
    tag: {
        backgroundColor: colors.FOREGROUND,
        color: colors.BACKGROUND,
        

        maxWidth: "50%",
        padding: 4,
        paddingHorizontal: 8,
        borderRadius: 100,
        margin: 4,

        alignContent: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    tagSelected:{
        backgroundColor: colors.ACCENT,
        color: colors.FOREGROUND,

        display: "flex",
        

        maxWidth: "50%",
        padding: 4,
        paddingHorizontal: 8,
        borderRadius: 100,
        margin: 4,

        alignContent: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    tagText:{
        fontFamily: colors.FONT,
        color: colors.BACKGROUND,
        fontSize: 20,
    }

})