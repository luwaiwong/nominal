import { StyleSheet, View, Text, ScrollView } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import LaunchInfo from "../styled/LaunchInfo";

import * as colors from "../styles";

export default function Dashboard(data) {
  let userData = data.data;
  let [pinnedLaunches, setPinnedLaunches] = useState<any>([]);
  let [upcomingLaunches, setUpcomingLaunches] = useState<any>([]);
  let [previousLaunches, setPreviousLaunches] = useState<any>([]);

  // App State
  let [tagsShown, setTagsShown] = useState<any>(true);
  let [pinnedShown, setPinnedShown] = useState<any>(true);
  let [previousShown, setPreviousShown] = useState<any>(true);
  let [upcomingShown, setUpcomingShown] = useState<any>(true);

  useEffect(() => {
    async function fetchData() {
      await userData.getUpcomingLaunches().then((data) => {
        setUpcomingLaunches(data);
      })
      await userData.getPreviousLaunches().then((data) => {
        setPreviousLaunches(data);
      });
      
    }
    fetchData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.topSection}>
          <MaterialIcons name="menu" style={styles.menuButton} />
          <Text style={styles.titleText}>Launches</Text>
          <MaterialCommunityIcons name="space-station"  style={styles.menuButton} />
      </View>
      {/* Pinned Section */}

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

      <View style={[styles.contentSection,{height:upcomingShown?"100%":0}]}>
        {upcomingLaunches.map((launch: any) => {
          return (
            <LaunchInfo key={launch.id} data={launch} user={userData}/>
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

      <View style={[styles.contentSection,{height:previousShown?"100%":0}]}>
        {previousLaunches.map((launch: any) => {
          return (
            <LaunchInfo key={launch.id} data={launch} user={userData}/>
          );
      })}
      
      </View>
    </ScrollView>
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

      width: '100%',
      backgroundColor: colors.BACKGROUND,
      padding: 10,
      height: 60,
    },
    titleText: {
      fontSize: 24,
      color: colors.FOREGROUND,
      // position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',

      fontFamily: colors.FONT,
    },
    menuButton:{
      color: colors.ACCENT,
      fontSize: 32,
    },
    immersiveButton:{},

    // Content Section
    contentSection: {
      display: 'flex',
      backgroundColor: colors.BACKGROUND,
      height: '100%',
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
      height: 1,

      marginLeft: '2.5%',
      marginBottom: 20,

      backgroundColor: colors.BACKGROUND_HIGHLIGHT,

    }
});