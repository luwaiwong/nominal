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
  let immersiveShown = props.data.immersive
  let upcomingLaunches = props.data.upcoming
  let previousLaunches = props.data.previous
  let pinnedLaunches = props.data.pinned
  let setPinned = props.data.setPinned

  // Page State
  let [pinnedShown, setPinnedShown] = useState<any>(true);
  let [upcomingShown, setUpcomingShown] = useState<any>(true);

    async function fetchPinned(){
      await userData.getPinnedLaunches().then((data)=>{
        setPinned(data)
      })
    }
    
    function Content(){
      return (
            <View style={styles.container}>
                {/* Padding for title bar */}
                <View style={styles.topPadding}/>
                {/* Scolling Area */}
                <ScrollView 
                  refreshControl={
                    <RefreshControl refreshing={false} onRefresh={()=>{fetchPinned()}} />
                  }
                >
                    {/* Highlight Launch */}
                    {upcomingLaunches[0] != undefined && <HighlightLaunchInfo data={upcomingLaunches[0]}  />}

                    {/* Pinned Launches */}
                    {/* <View>
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
                                <LaunchInfo key={launch.id} data={launch} user={userData} />
                            );
                        })}
                        </View> 
                    </View> */}
                    

                    {/* Upcoming Section */}
                    <View style={styles.contentHeaderSection} >
                        <Text style={styles.contentHeaderText} onPress={()=>setUpcomingShown(!upcomingShown)}>Filtered </Text>
                        <MaterialIcons 
                        name="arrow-forward-ios" 
                        style={upcomingShown?styles.contentHeaderIcon:styles.contentHeaderIconHidden} 
                        onPress={()=>setUpcomingShown(!upcomingShown)}
                        />
                    </View>
                    <View style={styles.contentSeperator}></View>

                    {/* Previous Launches */}
                    <View style={[styles.contentSection]}>
                        {previousLaunches.map((launch: any) => {
                        return (
                            <LaunchInfo key={launch.id} data={launch} user={userData}/>
                        );
                    })}
                    </View>
                    {/* Upcoming Launches */}
                    <View style={[styles.contentSection]}>
                        {upcomingLaunches.map((launch: any) => {
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