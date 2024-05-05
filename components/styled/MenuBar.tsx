import React from 'react'; 
import { View, Text , StyleSheet} from 'react-native'; 
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons'; 

import * as colors from '../styles';



export default function MenuBar({page, setPage}){
    return (
        <View style={styles.menuBar}>
            <MenuButton icon="home" onPress={()=>{}} label="dashboard" active={page == "dashboard"} />
            <MenuButton icon="rocket-launch" onPress={()=>{}} label="launches" active={false} />
            <MenuButton icon="settings" onPress={()=>{}} label="settings" active={false} />
        </View>
    );
}

function MenuButton({icon, onPress, label, active}){
    return (
        <View style={active?styles.buttonContainerActive:styles.buttonContainer}>
            <MaterialIcons name={icon} style={active?styles.buttonIconActive:styles.buttonIcon} />
            <Text style={styles.buttonText}>{label}</Text>
        </View>
    );

}

const styles = StyleSheet.create({
    menuBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: colors.BACKGROUND_HIGHLIGHT,
        padding: 6,

        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,

        width: "100%",
        position: "absolute",
        bottom: 0,
        left:0,

        zIndex: 100,
    },
    titleText: {
        fontSize: 20,
        color: colors.FOREGROUND,
    },

    // Button
    buttonContainer:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.BACKGROUND_HIGHLIGHT,
        padding: 0,
        flex: 1,
    },
    buttonContainerActive:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.ACCENT,
        padding: 0,
        flex: 1,

        borderRadius: 20,

    },
    buttonIcon: {
        fontSize: 35,
        color: colors.FOREGROUND,
    },
    buttonIconActive: {
        fontSize: 35,
        color: colors.FOREGROUND,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: colors.FONT,
        color: colors.FOREGROUND,

        marginTop:-8,
        marginBottom: 4,
    },
});