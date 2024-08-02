import React, {useContext, useEffect, useRef, useState} from 'react';
import { StyleSheet, View, Text, Animated, ScrollView, StatusBar, Dimensions, FlatList, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MaterialIcons } from 'react-native-vector-icons';

import LaunchInfo from '../styled/Launch';
import Loading from '../styled/Loading';
import {BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT} from '../styles';
import { UserContext } from '../data/UserContext';
import { BottomSheetAndroid } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import LaunchHighlight from '../styled/HighlightLaunch';

export default function Launches(props){
    const userContext = useContext(UserContext);

    // Animation Hooks
    let barMargin = useRef(new Animated.Value(0)).current;
    let pageMargin = useRef(new Animated.Value(0)).current;

    const [launches, setLaunches] = useState({upcoming: [], previous: []})

    // Check if data is updated every 5 seconds, if so update stuff
    useEffect(()=>{
      const intervalId = setInterval(() => {
        // console.log("bruh")
        let hasLaunches = userContext != null && userContext.launches != null && userContext.launches.upcoming != undefined && userContext.launches.upcoming.length > 0
        if (hasLaunches)
        {
          setLaunches(userContext.launches)
          
        }
      }, 2000); // 1000 milliseconds = 1 second

      // Clear interval on re-render to avoid memory leaks
      return () => clearInterval(intervalId);
    }, [])

    // Check if data is loaded
    if (userContext.launches === undefined){
        return <Loading/>
    }

    // INFO
    const nav = userContext.nav; 

    //#region Animation & Input for Top Bar
    let upcoming = Gesture.Tap();
    let previous = Gesture.Tap();

    upcoming.onFinalize(()=>toggleSelection("upcoming"));
    previous.onFinalize(()=>toggleSelection("previous"));

    let inputRange = [0, 100];
    let outputRange = ["5%", "55%"];
    let animatedBarMargin = barMargin.interpolate({inputRange, outputRange});

    inputRange = [0,100]
    outputRange = ["0%", "-100%"];
    let animatedPageMargin = pageMargin.interpolate({inputRange, outputRange});

    const toggleSelection = (selected: string) => {
      if (selected == "upcoming"){
        Animated.parallel([
          Animated.timing(barMargin, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
            
          }),
          Animated.timing(pageMargin, {
            toValue: 0,
            duration: 200, 
            useNativeDriver: false
          })
        ]).start()
      } else if (selected == "previous"){

        Animated.parallel([
          Animated.timing(barMargin, {
            toValue: 100,
            duration: 200,
            useNativeDriver: false,
            
          }),
          Animated.timing(pageMargin, {
            toValue: 100,
            duration: 200, 
            useNativeDriver: false
          })
        ]).start()
      }
      
    }

    //#endregion

    return (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
              {/* <MaterialIcons 
                  name="arrow-back-ios" 
                  style={styles.back} 
                  onPress={() => props.navigation.goBack()}>
              </MaterialIcons>
                <Text style={styles.title}>Launches</Text> */}
          </View>
          {/* Upcoming and Previous button */}
          <View style={styles.topSelectionContainer}>
            <GestureDetector gesture={upcoming}>
              <Text style={styles.topSelectionText}>Upcoming</Text> 
            </GestureDetector>
            <GestureDetector gesture={previous}>
              <Text style={styles.topSelectionText}>Previous</Text> 
            </GestureDetector>
          </View>
          {/* Animated Bar */}
          <Animated.View style={[styles.topSelectionBar, {marginLeft:animatedBarMargin}]}></Animated.View>

          {/* Content Section */}
          <Animated.View style={[styles.contentContainer, {marginLeft:animatedPageMargin}]}>
            {/* Upcoming Section */}
            <View style={[styles.contentSection]}>
              <FlatList
                  data={launches.upcoming}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <LaunchInfo data={item}  nav={nav}> </LaunchInfo>}
                  ListFooterComponent={<View style={styles.bottomPadding}></View>}
                  >
                  
              </FlatList>
            </View>
            {/* Previous Section */}
            <View style={[styles.contentSection]}>
              <FlatList
                  data={launches.previous
                  }
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <LaunchInfo data={item}  nav={nav}></LaunchInfo>}
                  ListFooterComponent={<View style={styles.bottomPadding}></View>}
                  >
                  
              </FlatList>
            </View> 
          </Animated.View>
        </View>
      );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
      height: Dimensions.get('window').height,
    },

    // Top Upcoming and Previous Selection Area
    topSelectionContainer:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 5,
      marginBottom: 5,
      height:43
    },
    topSelectionText:{
      fontSize: 24,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      width: '50%',
      textAlign: 'center',
    },
    topSelectionBar:{
      width: '40%',
      height: 2,
      backgroundColor: COLORS.FOREGROUND,
      borderRadius: 100,
      marginBottom: 10,
      marginHorizontal: "8%",
    
    },

    // Content Section
    contentContainer:{
      display: 'flex',
      flexDirection: 'row',
      // position: 'absolute',
      marginLeft: "0%",
      width: "200%",
      // height: Dimensions.get('window').height-TOP_BAR_HEIGHT-StatusBar.currentHeight-60,
      // paddingBottom: BOTTOM_BAR_HEIGHT,
      backgroundColor: 'white',
      
      overflow: "hidden",
      flex: 1
    },
    contentSection: {
      display: 'flex',

      // marginBottom: 50,
      // overflow: 'hidden',
      flex: 1
    },
    titleContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginTop: StatusBar.currentHeight,
        height: TOP_BAR_HEIGHT,
    },
    title:{
        fontSize: 24,
        color: COLORS.FOREGROUND,
        width: "100%",
        textAlign: 'center',
        alignContent: 'center',

        fontFamily: FONT,

        marginBottom: 2,
    },
    back:{
        position: 'absolute',
        width: 30,
        marginLeft: 10,

        fontSize: 26,
        color: COLORS.FOREGROUND,
        zIndex: 200,
    },
    bottomPadding:{
      height: BOTTOM_BAR_HEIGHT+5,
    }
});