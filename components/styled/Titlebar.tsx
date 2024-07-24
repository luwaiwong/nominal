import React from "react"
import { StyleSheet, View, Text, StatusBar } from "react-native"
import Animated from 'react-native-reanimated'

import { COLORS, FONT, TOP_BAR_HEIGHT } from "../styles";

export default function TitleBar(props){
    const pageScrollState = props.scrollState;
    return (
      <View style={styles.centerTopContainer}>
        <View style={styles.topContainer}>
          <Animated.View style={[styles.topAnimatedSection, {marginLeft: pageScrollState}]}>
              {/* <Text style={styles.titleText}>Settings</Text>
              <Text style={styles.titleText}>Launches</Text>
              <Text style={styles.titleText}>For You</Text>
              <Text style={styles.titleText}>Dashboard</Text>
              <Text style={styles.titleText}>News</Text> */}
              <Text style={styles.titleText}>For You</Text>
              <Text style={styles.titleText}>Dashboard</Text>
              <Text style={styles.titleText}>News</Text>
              {/* <Text style={styles.titleText}>Locations</Text> */}
              <Text style={styles.titleText}>Settings</Text>
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

    marginTop: StatusBar.currentHeight,
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
      textShadowOffset: {width: 2, height: 2},
      textShadowRadius: 5,
      elevation: 200,

      zIndex: 110,
    },
    menuButton:{
      color: COLORS.ACCENT,
      fontSize: 32,
    },

    
})