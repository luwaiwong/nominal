import React, {useRef} from 'react';
import { StyleSheet, View, Text, Animated, ScrollView, StatusBar, Dimensions, FlatList } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import LaunchInfo from '../styled/Launch';
import Loading from '../styled/Loading';
import {BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT} from '../styles';

export default function Launch(props){
    const nav = props.data.nav;
    const userData = props.data.userData;
    const upcomingLaunches = props.data.upcoming;
    const previousLaunches = props.data.previous;

    //#region Animation & Input for Top Bar
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

    //#endregion

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
              <FlatList
                  data={upcomingLaunches}
                  keyExtractor={(item, index) => index.toString()}
                  ListFooterComponent={<View style={styles.bottomPadding}></View>}
                  renderItem={({ item }) => <LaunchInfo data={item} user={userData} nav={nav}> </LaunchInfo>}>
              </FlatList>
            </View>
            {/* Previous Section */}
            <View style={[styles.contentSection]}>
              <FlatList
                  data={previousLaunches}
                  keyExtractor={(item, index) => index.toString()}
                  ListFooterComponent={<View style={styles.bottomPadding}></View>}
                  renderItem={({ item }) => <LaunchInfo data={item} user={userData} nav={nav}></LaunchInfo>}>
              </FlatList>
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
    bottomPadding:{
      height: BOTTOM_BAR_HEIGHT+10,
      width: "100%",
    },

    // Content Section
    contentContainer:{
      display: 'flex',
      flexDirection: 'row',
      // position: 'absolute',
      marginLeft: "0%",
      width: "200%",
      height: Dimensions.get('window').height-StatusBar.currentHeight,
      paddingBottom: BOTTOM_BAR_HEIGHT,
      
      overflow: "hidden",
    },
    contentSection: {
      display: 'flex',
      backgroundColor: COLORS.BACKGROUND,
      // marginBottom: BOTTOM_BAR_HEIGHT+250,
      // overflow: 'hidden',
      flex: 1
    },
});