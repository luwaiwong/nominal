import React, {useContext, useRef} from 'react';
import { StyleSheet, View, Text, Animated, ScrollView, StatusBar, Dimensions, FlatList, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MaterialIcons } from 'react-native-vector-icons';

import LaunchInfo from '../styled/Launch';
import Loading from '../styled/Loading';
import {BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT} from '../../constants/styles';
import { UserContext } from "src/utils/UserContext"
import Event from '../styled/Event';

export default function Events(props){
    const userContext = useContext(UserContext);
    const upcomingEvents = userContext.events.upcoming;
    const previousEvents = userContext.events.previous;

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
        <View style={styles.container}>
          <View style={styles.titleContainer}>
              <MaterialIcons 
                  name="arrow-back-ios" 
                  style={styles.back} 
                  onPress={() => props.navigation.goBack()}>
              </MaterialIcons>
                <Text style={styles.title}>All Events</Text>
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
                  data={upcomingEvents}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <Event eventData={item}> </Event>}>
              </FlatList>
            </View>
            {/* Previous Section */}
            <View style={[styles.contentSection]}>
              <FlatList
                  data={previousEvents}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <Event eventData={item} ></Event>}>
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
      marginBottom: 10,
      marginLeft: "5%",
    
    },

    // Content Section
    contentContainer:{
      display: 'flex',
      flexDirection: 'row',
      // position: 'absolute',
      marginLeft: "0%",
      width: "200%",
      height: Dimensions.get('window').height,
      paddingBottom: BOTTOM_BAR_HEIGHT,
      
      overflow: "hidden",
    },
    contentSection: {
      display: 'flex',
      backgroundColor: COLORS.BACKGROUND,
      marginBottom: 50,
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
    }
});