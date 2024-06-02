import React from "react"
import { StyleSheet, View, Text,Pressable, StatusBar } from "react-native"
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import { COLORS, FONT, TOP_BAR_HEIGHT } from "../styles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TitleBar(props){
    const immersive = props.immersive;
    const setImmersive = props.setImmersive;
    const tagsOpen = props.tagsOpen;
    const setTagsOpen = props.setTagsOpen;
    // console.log(immersive);
    return (
        <View style={styles.topSection}>
            {/* <Pressable 
              onPress={()=>{
                setTagsOpen(!tagsOpen);
              }}>
                <MaterialIcons name="menu" style={styles.menuButton} /> 
            </Pressable> */}

            <Text style={styles.titleText}>Launches</Text>

            {/* <Pressable 
              onPress={()=>{
                setImmersive(!immersive);
              }}>
                <MaterialCommunityIcons name="space-station"  style={styles.menuButton} />    
            </Pressable> */}
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
      justifyContent: 'center',

      position: 'absolute',
      top: 0,

      marginTop: StatusBar.currentHeight-10,
      width: '100%',
      // backgroundColor: colors.BACKGROUND,
      paddingHorizontal: 10,
      height: TOP_BAR_HEIGHT,
      zIndex: 110,
    },
    titleText: {
      fontSize: 24,
      fontFamily: FONT,
      color: COLORS.FOREGROUND,
      // position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      
      width: "100%",

      
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: {width: 0, height: 1},
      textShadowRadius: 1,
      elevation: 200,
    },
    menuButton:{
      color: COLORS.ACCENT,
      fontSize: 32,
    },

    
})