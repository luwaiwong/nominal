import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import PagerView from 'react-native-pager-view';

import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import LaunchInfo from "../styled/LaunchInfo";
import ImmersivePage from "../styled/ImmersivePage";

import * as colors from "../styles";
import Tags from "./Tags";
import Loading from "../styled/Loading";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard(data) {
  let userData = data.data;
  let [pinnedLaunches, setPinnedLaunches] = useState<any>([]);
  let [upcomingLaunches, setUpcomingLaunches] = useState<any>([]);
  let [previousLaunches, setPreviousLaunches] = useState<any>([]);

  // App State
  let [tagsShown, setTagsShown] = useState<any>(false);
  let [immersiveShown, setImmersiveShown] = useState<any>(false);
  let [pinnedShown, setPinnedShown] = useState<any>(true);
  let [previousShown, setPreviousShown] = useState<any>(true);
  let [upcomingShown, setUpcomingShown] = useState<any>(true);
  let [loading, setLoading] = useState<any>(true);

  function Title (){
    let currentScreen = "Launches";
    if (tagsShown){
      currentScreen = "Tags";
    }
    else{
      currentScreen = "Launches";
    }
    return (
      <Text style={immersiveShown?styles.titleTextImmersive:styles.titleText}>{currentScreen}</Text>
    );

  }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    await userData.getUpcomingLaunches().then((data) => {
      setUpcomingLaunches(data);
      setLoading(false);
    })
    await userData.getPreviousLaunches().then((data) => {
      setPreviousLaunches(data);
    });
    await userData.getPinnedLaunches().then((data) => {
      setPinnedLaunches(data);
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
    userData.getPinnedLaunches().then((data) => {
      setPinnedLaunches(data);
    });
    userData.getUpcomingLaunches().then((data) => {
      setUpcomingLaunches(data);
    })
  }

  function setImmersive(shown: boolean){
    userData.immersive = shown;
    setImmersiveShown(shown);
  }
  
  function RegularMode(){
    return (
      <SafeAreaView>
        <View>
          {/* Top Bar */}
          <View style={styles.topSection}>
            <Pressable onPress={()=>toggleTags()}>
              <MaterialIcons name="menu" style={immersiveShown?styles.immersiveButton:styles.menuButton} />
            </Pressable>
            <Title/>
            <Pressable onPress={()=>setImmersive(!immersiveShown)}>
              <MaterialCommunityIcons name="space-station"  style={immersiveShown?styles.immersiveButton:styles.menuButton} />    
            </Pressable>
          </View>
          <View style={styles.topPadding}></View>
          {/* Scolling Area */}
          <ScrollView >   
          {/* Pinned Launches */}
          {pinnedLaunches.length>0 && 
            <View>
              <Pressable onPress={()=>setPinnedShown(!pinnedShown)}>
                <View style={styles.contentHeaderSection} >
                  <Text style={styles.contentHeaderText}>Pinned </Text>
                  <MaterialIcons 
                    name="arrow-forward-ios" 
                    style={pinnedShown?styles.contentHeaderIcon:styles.contentHeaderIconHidden} 
                  />
                </View>
              </Pressable>
              <View style={styles.contentSeperator}></View>

              <View style={[styles.contentSection,{height:pinnedShown?"auto":0}]}>
                {pinnedLaunches.map((launch: any) => {
                  return (
                    <LaunchInfo key={launch.id} data={launch} user={userData} updatePinned={updatePinned}/>
                  );
              })}
              </View> 
            </View>
          }

          {/* Upcoming Section */}
          <View style={styles.contentHeaderSection} >
            <Text style={styles.contentHeaderText} onPress={()=>setUpcomingShown(!upcomingShown)}>Upcoming </Text>
            <MaterialIcons 
              name="arrow-forward-ios" 
              style={upcomingShown?styles.contentHeaderIcon:styles.contentHeaderIconHidden} 
              onPress={()=>setUpcomingShown(!upcomingShown)}
            />
          </View>
          <View style={styles.contentSeperator}></View>

          <View style={[styles.contentSection,{height:upcomingShown?"auto":0}]}>
            {upcomingLaunches.map((launch: any) => {
              return (
                <LaunchInfo key={launch.id} data={launch} user={userData} updatePinned={updatePinned}/>
              );
          })}
          
          </View>
          {/* Past Launches */}
          <View style={styles.contentHeaderSection} >
            <Text style={styles.contentHeaderText} onPress={()=>setPreviousShown(!previousShown)}>Previous </Text>
            <MaterialIcons 
              name="arrow-forward-ios" 
              style={previousShown?styles.contentHeaderIcon:styles.contentHeaderIconHidden}
              onPress={()=>setPreviousShown(!previousShown)}
            />
          </View>
          <View style={styles.contentSeperator}></View>

          <View style={[styles.contentSection,{height:previousShown?"auto":0, marginBottom:125 }]}>
            {previousLaunches.map((launch: any) => {
              return (
                <LaunchInfo key={launch.id} data={launch} user={userData} updatePinned={updatePinned}/>
              );
          })}
          
          </View>
        </ScrollView>
        </View>
      </SafeAreaView>
      );
  }

  function ImmersiveMode(){
    return (
      // <Text>Immersive Mode</Text>
        // <View key="1" style={iStyles.immersivePage}>
        //   <Text style={iStyles.immersivePageTitle}>First page</Text>
        // </View>
      <PagerView style={iStyles.immersiveSection} initialPage={0} orientation="vertical" >
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
    contentSection: {
      display: 'flex',
      backgroundColor: colors.BACKGROUND,
      overflow: 'hidden',
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
    }
});
const iStyles = StyleSheet.create({
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