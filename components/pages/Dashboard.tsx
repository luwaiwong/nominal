import { StyleSheet, View, Text, ScrollView, RefreshControl, StatusBar, Dimensions } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';

import {COLORS, FONT, TOP_BAR_HEIGHT,BOTTOM_BAR_HEIGHT}from "../styles";
import HighlightLaunchInfo from "../styled/HighlightLaunchInfo";
import LaunchInfo from "../styled/LaunchInfo";
import Loading from "../styled/Loading";


export default function Dashboard(props) {
  let userData = props.data.userData;

  let recentlyLaunched = props.data.launchData.dashboardRecent
  let upcomingFiltered = props.data.launchData.dashboardFiltered
  let highlights = props.data.launchData.dashboardHighlights

  let upcomingLaunches = props.data.upcoming
  let previousLaunches = props.data.previous
  let pinnedLaunches = props.data.launchData.pinned._j // I DON'T KNOW WHY _J IS REQUIRED

  // Page State
  let [pinnedShown, setPinnedShown] = useState<any>(true);
  let [upcomingShown, setUpcomingShown] = useState<any>(true);
  let [recentShown, setRecentShown] = useState<any>(true);

    async function refreshData(){
      props.data.reloadData()
    }
    
    function Content(){
      return (
            <View style={styles.container}>
                {/* Padding for title bar */}
                <View style={styles.topPadding}/>
                {/* Scolling Area */}
                <ScrollView 
                  // Refresh Control
                  refreshControl={
                    <RefreshControl refreshing={false} onRefresh={()=>{refreshData()}} />
                  }
                >
                    {/* Highlight Launch */}
                    {highlights[0] != undefined && <HighlightLaunchInfo data={highlights[0]}  />}

                    {/* Pinned Launches */}
                    {pinnedLaunches != undefined && pinnedLaunches.length > 0 && 
                    <View>
                      {/* Pinned Header */}
                      <View style={styles.contentHeaderSection} >
                          <Text style={styles.contentHeaderText}>Pinned </Text>
                          <MaterialIcons 
                              name="arrow-forward-ios" 
                              style={styles.contentHeaderIcon} 
                          />
                      </View>
                      <View style={styles.contentSeperator}></View>
                      
                      {/* Pinned Launches */}
                      <View style={[styles.contentSection]}>
                          {pinnedLaunches.map((launch: any) => {
                          return (
                              <LaunchInfo key={launch.id} data={launch} user={userData} />
                          );
                      })}
                      </View> 
                    </View>
                    }
                    
                    {/* Recently Launched */}
                    <View style={styles.contentHeaderSection} >
                        <Text style={styles.contentHeaderText} >Recently Launched </Text>
                        <MaterialIcons 
                        name="arrow-forward-ios" 
                        style={styles.contentHeaderIcon} 
                        />
                    </View>
                    <View style={styles.contentSeperator}></View>

                    {/* Recent Launches */}
                    <View style={[styles.contentSection]}>
                        {recentlyLaunched.map((launch: any) => {
                        return (
                            <LaunchInfo key={launch.id} data={launch} user={userData}/>
                        );
                    })}
                    </View>

                    {/* Upcoming Section */}
                    <View style={styles.contentHeaderSection} >
                        <Text style={styles.contentHeaderText}>Upcoming </Text>
                        <MaterialIcons 
                        name="arrow-forward-ios" 
                        style={styles.contentHeaderIcon} 
                        />
                    </View>
                    <View style={styles.contentSeperator}></View>

                    {/* Upcoming Launches */}
                    <View style={[styles.contentSection]}>
                        {upcomingFiltered.map((launch: any) => {
                        return (
                            <LaunchInfo key={launch.id} data={launch} user={userData} />
                        );
                    })}
                    </View>
                    <View style={styles.bottomBuffer}/>
                </ScrollView>
            </View>
      );
        
    }

    if (upcomingLaunches === undefined){
      return <Loading/>
    }
    return <Content/>;
    
}

const styles = StyleSheet.create({
    container: {
      height: Dimensions.get('window').height-BOTTOM_BAR_HEIGHT+TOP_BAR_HEIGHT,
    },
    topPadding:{
      height: TOP_BAR_HEIGHT+StatusBar.currentHeight,
      width: "100%",
    },
    // Content Section
    contentSection: {
      display: 'flex',
      backgroundColor: COLORS.BACKGROUND,
      overflow: 'hidden',
    },
    contentHeaderSection: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    contentHeaderText: {
      fontSize: 32,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      
      marginLeft: 8,
      marginBottom: 5,
    },
    contentHeaderIcon: {
      color: COLORS.FOREGROUND,
      fontSize: 28,
      marginLeft: 8,
      marginBottom: 8,
    },
    contentHeaderIconHidden: {
      color: COLORS.FOREGROUND,
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

      backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
    },
    bottomBuffer:{
        height: BOTTOM_BAR_HEIGHT+140,
    }
});