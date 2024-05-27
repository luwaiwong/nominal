import React, {useRef} from 'react';
import { StyleSheet, View, Text, Animated, ScrollView, StatusBar } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import LaunchInfo from '../../styled/LaunchInfo';
import Loading from '../../styled/Loading';
import {BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT} from '../../styles';

export default function RegularLaunches(props){
    const userData = props.userData;
    const upcomingLaunches = props.upcomingLaunches;
    const previousLaunches = props.previousLaunches;

    let upcoming = Gesture.Tap();
    let previous = Gesture.Tap();

    upcoming.onFinalize(()=>toggleSelection("upcoming"));
    previous.onFinalize(()=>toggleSelection("previous"));

    let barMargin = useRef(new Animated.Value(0)).current;
    let inputRange = [0, 100];
    let outputRange = ["5%", "55%"];
    let animatedBarMargin = barMargin.interpolate({inputRange, outputRange});

    let pageMargin = useRef(new Animated.Value(0)).current;
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

    return (
        <View>
          <View style={styles.topPadding}></View>
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
              <ScrollView >  
              {upcomingLaunches.length == 0  && <Loading/>}  
                {upcomingLaunches.map((launch: any) => {
                  return (
                    <LaunchInfo key={launch.id} data={launch} user={userData}/>
                  );
              })}
              </ScrollView>
            </View>
            {/* Previous Section */}
            <View style={[styles.contentSection]}>
              <ScrollView >  
                {previousLaunches.length == 0 && <Loading/>}
                  {previousLaunches.map((launch: any) => {
                    return (
                      <LaunchInfo key={launch.id} data={launch} user={userData}/>
                    );
                })}
              </ScrollView>
            </View> 
          </Animated.View>
        </View>
      );
}


const styles = StyleSheet.create({
    topPadding:{
      height: TOP_BAR_HEIGHT+StatusBar.currentHeight,
      width: "100%",
    },

    // Top Upcoming and Previous Selection Area
    topSelectionContainer:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 5,
      marginBottom: 5,
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
      marginBottom: 20,
      marginLeft: "5%",
    
    },

    // Content Section
    contentContainer:{
      display: 'flex',
      flexDirection: 'row',
      // position: 'absolute',
      marginLeft: "0%",
      width: "200%",

      overflow: "visible"
    },
    contentSection: {
      display: 'flex',
      backgroundColor: COLORS.BACKGROUND,
      marginBottom: BOTTOM_BAR_HEIGHT+250,
      overflow: 'hidden',
      flex: 1
    },
});