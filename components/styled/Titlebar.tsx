import React from "react"
import { StyleSheet, View, Text,Pressable, StatusBar } from "react-native"
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import { COLORS, FONT, TOP_BAR_HEIGHT } from "../styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from 'react-native-reanimated'

export default function TitleBar(props){
    const immersive = props.immersive;
    const setImmersive = props.setImmersive;
    const tagsOpen = props.tagsOpen;
    const setTagsOpen = props.setTagsOpen;
    const pageScrollState = props.scrollState;
    return (
      <View style={styles.centerTopContainer}>
        <View style={styles.topContainer}>
          <Animated.View style={[styles.topAnimatedSection, {marginLeft: pageScrollState}]}>
              <Text style={styles.titleText}>Settings</Text>
              <Text style={styles.titleText}>Launches</Text>
              <Text style={styles.titleText}>For You</Text>
              <Text style={styles.titleText}>Dashboard</Text>
              <Text style={styles.titleText}>News</Text>
          </Animated.View>
        </View>
      </View>
      

    );
}


const styles = StyleSheet.create({
  // Header Bar Section
  centerTopContainer:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: "100%",
    height: TOP_BAR_HEIGHT,
    zIndex: 110,
  },
  topContainer:{

    position: 'absolute',
    top: 0,

    marginTop: StatusBar.currentHeight-10,
    width: 125,
    height: TOP_BAR_HEIGHT,
    zIndex: 110,

    overflow: 'hidden',
  },
    topAnimatedSection: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',

      position: 'absolute',
      top: 0,

      width: "100%",
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
      
      width: 150,

      
      textShadowColor: 'rgba(0, 0, 0, 0.6)',
      textShadowOffset: {width: 0, height: 0.5},
      textShadowRadius: 1,
      elevation: 200,
    },
    menuButton:{
      color: COLORS.ACCENT,
      fontSize: 32,
    },

    
})