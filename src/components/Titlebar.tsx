import React from "react"
import { StyleSheet, View, Text, StatusBar } from "react-native"
import Animated, { SharedValue } from 'react-native-reanimated'

import { COLORS, FONT, TOP_BAR_HEIGHT } from "src/styles";

export default function TitleBar(props: {scrollState: any, titles:any}){
    const pageScrollState = props.scrollState;
    const titles = props.titles
    return (
      <View style={styles.centerTopContainer}>
        <View style={styles.topContainer}>
          <Animated.View style={[styles.topAnimatedSection, {marginLeft: pageScrollState}]}>
            {titles.map((title)=>{
              return <Text key={title} style={styles.titleText}>{title}</Text>
            })}
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

    // backgroundColor: "white",

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
      marginTop: -5,

      
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