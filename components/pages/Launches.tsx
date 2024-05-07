import { StyleSheet, View, Text, ScrollView, Animated, Pressable } from "react-native";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import PagerView from 'react-native-pager-view';

import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import LaunchInfo from "../styled/LaunchInfo";
import ImmersivePage from "../styled/ImmersivePage";

import * as colors from "../styles";
import Tags from "./Tags";
import Loading from "./Loading";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function Dashboard(data) {
  let userData = data.data;
  let [pinnedLaunches, setPinnedLaunches] = useState<any>([]);
  let [upcomingLaunches, setUpcomingLaunches] = useState<any>([]);
  let [previousLaunches, setPreviousLaunches] = useState<any>([]);

  // App State
  let [tagsShown, setTagsShown] = useState<any>(false);
  let [immersiveShown, setImmersiveShown] = useState<any>(false);
  let [upcomingLoading, setUpcomingLoading] = useState<any>(true);
  let [previousLoading, setPreviousLoading] = useState<any>(true);

  function Title (){
    let currentScreen = "All Launches";
    if (tagsShown){
      currentScreen = "Tags";
    }
    else{
      currentScreen = "All Launches";
    }
    return (
      <Text style={immersiveShown?styles.titleTextImmersive:styles.titleText}>{currentScreen}</Text>
    );

  }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await userData.getAllUpcomingLaunches().then((data) => {
      setUpcomingLaunches(data);
      setUpcomingLoading(false);
    })
    await userData.getPreviousLaunches().then((data) => {
      setPreviousLaunches(data);
      setPreviousLoading(false);
    });
    
  }
  async function toggleTags(){
    setTagsShown(!tagsShown);

    if (tagsShown){
      fetchData();
    }
    // #TODO: Reload upcoming launches data when switching back to launches page
  }

  function updatePinned(){
  }

  
  function RegularMode(){
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
        <View style={styles.topSelectionContainer}>
          <GestureDetector gesture={upcoming}>
            <Text style={styles.topSelectionText}>Upcoming</Text> 
          </GestureDetector>
          <GestureDetector gesture={previous}>
            <Text style={styles.topSelectionText}>Previous</Text> 
          </GestureDetector>
        </View>
        <Animated.View style={[styles.topSelectionBar, {marginLeft:animatedBarMargin}]}></Animated.View>
          {/* Upcoming Section */}
          <Animated.View style={[styles.contentContainer, {marginLeft:animatedPageMargin}]}>
            <View style={[styles.contentSection]}>
              <ScrollView >  
            {upcomingLoading && <Loading/>}  
              {upcomingLaunches.map((launch: any) => {
                return (
                  <LaunchInfo key={launch.id} data={launch} user={userData} updatePinned={updatePinned}/>
                );
            })}
        </ScrollView>
            </View>
            <View style={[styles.contentSection]}>
              <ScrollView >  
            {previousLoading && <Loading/>}
              {previousLaunches.map((launch: any) => {
                return (
                  <LaunchInfo key={launch.id} data={launch} user={userData} updatePinned={updatePinned}/>
                );
            })}
        </ScrollView>
            </View>
          </Animated.View>
      </View>
      );
  }

  function ImmersiveMode(){
    return (
      // <Text>Immersive Mode</Text>
        // <View key="1" style={iStyles.immersivePage}>
        //   <Text style={iStyles.immersivePageTitle}>First page</Text>
        // </View>
      <PagerView style={istyles.immersiveSection} initialPage={0} orientation="vertical" >
        {upcomingLaunches.map((launch: any) => {
            return (
              <ImmersivePage key={launch.id} data={launch} user={userData}/>
            );
        })}
      </PagerView>
    )
  }

  function CurrentScreen(){
    if (immersiveShown){
      return ImmersiveMode();
    }
    else{
      return RegularMode();
    }
  }

  return (
    <View>
      <View style={styles.topSection}>
        <Pressable onPress={()=>toggleTags()}>
          <MaterialIcons name="menu" style={immersiveShown?styles.immersiveButton:styles.menuButton} />
        </Pressable>
        <Title/>
        <Pressable onPress={()=>setImmersiveShown(!immersiveShown)}>
          <MaterialCommunityIcons name="space-station"  style={immersiveShown?styles.immersiveButton:styles.menuButton} />    
        </Pressable>
      </View>
      <View style={styles.topPadding}></View>
      <Tags shown={tagsShown} userData={userData}/>
      <CurrentScreen/>
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
      color: colors.FOREGROUND,
      // position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',

      fontFamily: colors.FONT,
    },
    titleTextImmersive: {
      fontSize: 0,
      color: colors.BACKGROUND,
      // position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',

      fontFamily: colors.FONT,
    },
    menuButton:{
      color: colors.ACCENT,
      fontSize: 32,
    },
    immersiveButton:{
      color: colors.ACCENT,
      backgroundColor: colors.FOREGROUND,
      borderRadius: 20,
      paddingHorizontal: 5,
      marginLeft:-5,
      marginRight: -5,
      fontSize: 32,
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
      backgroundColor: colors.BACKGROUND,
      overflow: 'hidden',
      flex: 1
    },
    contentHeaderSection: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    contentHeaderText: {
      fontSize: 32,
      color: colors.FOREGROUND,
      fontFamily: colors.FONT,
      
      marginLeft: 8,
      marginBottom: 5,
    },
    contentHeaderIcon: {
      color: colors.FOREGROUND,
      fontSize: 28,
      marginLeft: 8,
      marginBottom: 8,
    },
    contentHeaderIconHidden: {
      color: colors.FOREGROUND,
      fontSize: 28,
      marginLeft: 8,
      marginBottom: 8,
      transform: [{ rotate: '90deg'}],
    },
    contentSeperator:{
      width: '95%',
      height: 3,
      borderRadius: 100,

      marginLeft: '2.5%',
      marginBottom: 20,

      backgroundColor: colors.BACKGROUND_HIGHLIGHT,
    },
    topSelectionContainer:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 5,
      marginBottom: 5,
    },
    topSelectionText:{
      fontSize: 24,
      color: colors.FOREGROUND,
      fontFamily: colors.FONT,
      width: '50%',
      textAlign: 'center',
    },
    topSelectionBar:{
      width: '40%',
      height: 2,
      backgroundColor: colors.FOREGROUND,
      borderRadius: 100,
      marginBottom: 20,
      marginLeft: "5%",
    
    }
});
const istyles = StyleSheet.create({
  immersiveSection:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    

    marginTop: -60,

    width: '100%',
    height: '100%',

    backgroundColor: colors.FOREGROUND,
  
  },
  immersivePage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    
    width: '100%',
    height: '100%',


    paddingTop: 60,
    backgroundColor: colors.FOREGROUND,
  },
  immersivePageTitle:{
    fontSize: 32,
    color: colors.BACKGROUND,
    fontFamily: colors.ACCENT,
    margin: 16,
  },
});