import React from "react"
import { StyleSheet, View, Text,Pressable } from "react-native"
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import { COLORS, FONT } from "../styles";

export default function TitleBar(){
    return (
        <View style={styles.topSection}>
            <Pressable >
                <MaterialIcons name="menu" style={styles.menuButton} /> 
            </Pressable>
            <Text style={styles.titleText}>Launches</Text>
            <Pressable >
                <MaterialCommunityIcons name="space-station"  style={styles.menuButton} />    
            </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
  // Header Bar Section
    topSection: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'space-between',

      position: 'absolute',
      top: 0,


      width: '100%',
      // backgroundColor: colors.BACKGROUND,
      padding: 10,
      height: 55,
      zIndex: 110,
    },
    topPadding:{
      height: 60,
      width: "100%",
    },
    titleText: {
      fontSize: 24,
      color: COLORS.FOREGROUND,
      // position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',

      fontFamily: FONT,
    },
    menuButton:{
      color: COLORS.ACCENT,
      fontSize: 32,
    },
})