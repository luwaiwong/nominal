import { StyleSheet, View, Text, ScrollView, RefreshControl, StatusBar, Dimensions, Pressable } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';

import {COLORS, FONT, TOP_BAR_HEIGHT,BOTTOM_BAR_HEIGHT}from "../styles";
import HighlightLaunch from "../styled/HighlightLaunch";
import LaunchInfo from "../styled/LaunchSimple";
import Loading from "../styled/Loading";
import Event from "../styled/Event";
import Article from "../styled/Article";
import LaunchCarousel from "../styled/LaunchCarousel";


export default function Dashboard(props) {
  let userData = props.data.userData;

  // All data
  let launchData = props.data.launchData
  let upcoming = launchData.upcoming
  let recentlyLaunched = launchData.dashboardRecent
  let upcomingFiltered = launchData.dashboardFiltered
  let highlights = launchData.dashboardHighlights

  let events = props.data.launchData.dashboardEvents
  let news = props.data.launchData.dashboardNews

  let nav = props.data.nav


  let pinnedLaunches = props.data.launchData.pinned._j // I DON'T KNOW WHY _J IS REQUIRED

    async function refreshData(){
      props.data.reloadData()
    }
    
    function Content(){
      return (
            <View style={styles.container}>
                {/* Padding for title bar */}
                <View style={styles.topBackground} />
                <View style={styles.topPadding}/>
                {/* Scolling Area */}
                <ScrollView 
                  // Refresh Control
                  refreshControl={
                    <RefreshControl refreshing={false} onRefresh={()=>{refreshData()}} />
                  }
                >
                  <View style={{height: 10}}/>
                  {/* Highlight Launch */}
                  {highlights[0] != undefined && <HighlightLaunch data={highlights[0]}  />}

                  {/* <View style={{marginTop: -10}}></View> */}

                  <LaunchCarousel content={recentlyLaunched} userData={userData} type="launch" nav={nav} />

                  {/* Upcoming Launches */}
                  <View style={[styles.contentSection]}>
                    <Pressable onPress={()=>{nav.navigate('Launches', {data: launchData.upcoming,user: userData, title:"Upcoming" })}}>
                      <View style={styles.contentHeaderSection} >
                          <Text style={styles.contentHeaderText} >Upcoming </Text>
                          <View style={styles.seeMoreSection}>
                            <Text style={styles.contentSeeMore} >See All </Text>
                            <MaterialIcons 
                            name="arrow-forward-ios" 
                            style={styles.contentHeaderIcon} 
                            />
                          </View>
                      </View>
                    </Pressable>
                    {upcomingFiltered.map((launch: any) => {
                    return (
                        <LaunchInfo key={launch.id} data={launch} user={userData} />
                    );
                    })}
                  </View>


                  <View style={[styles.buffer]}></View>

                  {/* Show events here */}
                  
                  <Pressable onPress={()=>props.data.setPage(4)}>
                    <View style={styles.newsHeaderSection} >
                        <Text style={styles.sectionHeaderText} >News & Events </Text>
              
                    </View>
                  </Pressable>
                  {/* Events */}
                  <View style={[styles.contentSection]}>
                    <Pressable onPress={()=>nav.navigate("All Events", {data: launchData.events, title:"Events" })}>
                      <View style={styles.contentHeaderSection} >
                          <Text style={styles.contentHeaderText} >Events </Text>
                          
                          <View style={styles.seeMoreSection}>
                            <Text style={styles.contentSeeMore} >See All </Text>
                            <MaterialIcons 
                            name="arrow-forward-ios" 
                            style={styles.contentHeaderIcon} 
                            />

                          </View>
                      </View>
                    </Pressable>
                    {events.map((launch: any) => {
                    return (
                        <Event key={launch.id} eventData={launch}  />
                    );
                    })} 
                  </View>
                  
                  <View style={[styles.contentSection]}>
                    <Pressable onPress={()=>nav.navigate("All News", {data: launchData.news, title:"Articles" })}>
                      <View style={styles.contentHeaderSection} >
                          <Text style={styles.contentHeaderText} >Articles </Text>
                          
                          <View style={styles.seeMoreSection}>
                            <Text style={styles.contentSeeMore} >See All </Text>
                            <MaterialIcons 
                            name="arrow-forward-ios" 
                            style={styles.contentHeaderIcon} 
                            />

                          </View>
                      </View>
                    </Pressable>
                  
                        {news.map((launch: any) => {
                        // console.log(launch)
                        return (

                            <Article key={launch.id} articleData={launch}  />
                        );
                    })}
                  </View>
                  
                  
                  <View style={[styles.buffer]}></View>
                  <View style={styles.bottomPadding}></View>
                </ScrollView>
            </View>
      );
        
    }

    if (launchData === undefined){
      return <Loading/>
    }
    return <Content/>;
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // paddingBottom : BOTTOM_BAR_HEIGHT,
      // backgroundColor: 'white',
    },
    topBackground:{
      position: 'absolute',
      top: 0,
      height: TOP_BAR_HEIGHT+StatusBar.currentHeight,
      width: "100%",


      zIndex: 100,

    },
    topPadding:{
      height: TOP_BAR_HEIGHT+StatusBar.currentHeight,
      width: "100%",
    },
    bottomPadding:{
      height: BOTTOM_BAR_HEIGHT,
      width: "100%",
    },
    // Content Section
    contentSection: {
      display: 'flex',
      backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
      borderRadius: 15,
      marginHorizontal: 10,
      marginTop: 10,
      overflow: 'hidden',
    },
    contentHeaderSection: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    sectionHeaderText:{
      fontSize: 25,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      marginLeft: 12,
      marginTop: 5
    },
    contentHeaderText: {
      fontSize: 22,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,


      
      marginLeft: 12,
      marginTop: 5
      // marginBottom: 5,
    },
    buffer:{
      height: 10,
    },
    seeMoreSection:{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginRight: 12,
    },
    contentSeeMore: {
      fontSize: 18,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      
      // marginLeft: 12,
      marginBottom: 2,
      // marginRight: 12,
    },
    contentHeaderIcon: {
      color: COLORS.FOREGROUND,
      fontSize: 18,
      marginTop: 8,
      // marginLeft: 8,
      marginBottom: 5,
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

    // Sections
    newsHeaderSection:{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
     marginHorizontal: 10,
    },

});