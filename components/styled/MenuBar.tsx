import React from 'react'; 
import { View, Text , StyleSheet} from 'react-native'; 
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons'; 

import {COLORS, FONT, BOTTOM_BAR_HEIGHT} from '../styles';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';



export default function MenuBar({page, setPage}){
    return (
        <View style={styles.menuBar}>
            <MenuButton icon="home" setPage={()=>setPage(0)} label="for you" active={page == "for you"} />
            <MenuButton icon="home" setPage={()=>setPage(0)} label="dashboard" active={page == "dashboard"} />
            <MenuButton icon="rocket-launch" setPage={()=>setPage(1)} label="launches" active={page == "launches"} />
            <MenuButton icon="settings" setPage={()=>setPage("settings")} label="settings" active={page=="settings"} />
        </View>
    );
}

function MenuButton({icon, setPage, label, active}){
    function onPressed(){
        setPage();
    }
    let tap = Gesture.Tap();
    tap.onFinalize(()=>onPressed());
    
    return (
        <GestureDetector gesture={tap}>
            <View style={active?styles.buttonContainerActive:styles.buttonContainer}>
                <MaterialIcons name={icon} style={active?styles.buttonIconActive:styles.buttonIcon} />
                <Text style={styles.buttonText}>{label}</Text>
            </View>
        </GestureDetector>
    );

}

const styles = StyleSheet.create({
    menuBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        padding: 6,

        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,

        width: "100%",
        height: BOTTOM_BAR_HEIGHT,
        position: "absolute",
        bottom: 0,
        left:0,

        zIndex: 100,
    },
    titleText: {
        fontSize: 20,
        color: COLORS.FOREGROUND,
    },

    // Button
    buttonContainer:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        padding: 0,
        flex: 1,
    },
    buttonContainerActive:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.ACCENT,
        padding: 0,
        flex: 1,

        borderRadius: 20,

    },
    buttonIcon: {
        fontSize: 35,
        color: COLORS.FOREGROUND,
    },
    buttonIconActive: {
        fontSize: 35,
        color: COLORS.FOREGROUND,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,

        marginTop:-8,
        marginBottom: 4,
    },
});