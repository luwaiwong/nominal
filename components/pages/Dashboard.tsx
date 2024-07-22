import { StyleSheet, View, Text, ScrollView, RefreshControl, StatusBar, Dimensions, Pressable, TouchableHighlight } from "react-native";
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
import { TouchableOpacity } from "react-native-gesture-handler";


export default function Dashboard(props) {
  let userData = props.data.userData;

  // All data
  let launchData = props.data.launchData
  let upcoming = launchData.upcoming
  let recentlyLaunched = launchData.dashboardRecent
  let upcomingFiltered = launchData.dashboardFiltered
  let highlights = launchData.dashboardHighlights
  const upcomingEvents = props.data.launchData.events.upcoming;
  const previousEvents = props.data.launchData.events.previous;

  let events = props.data.launchData.dashboardEvents
  let news = props.data.launchData.dashboardNews

  let nav = props.data.nav


  let pinnedLaunches = props.data.launchData.pinned._j // I DON'T KNOW WHY _J IS REQUIRED

  const [refreshing, setRefreshing] = useState(false)
  async function refreshData(){
    setRefreshing(true)
    await props.data.reloadData().then((data)=> {
      console.log("Finishing Refresh")
      setRefreshing(false)
    })
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
                  <RefreshControl refreshing={refreshing} onRefresh={()=>{refreshData()}
                  } colors={[COLORS.FOREGROUND]} progressBackgroundColor={COLORS.BACKGROUND_HIGHLIGHT}/>
                }
              >
                <View style={{height: 10}}/>
                {/* Highlight Launch */}
                {highlights[0] != undefined && <HighlightLaunch data={highlights[0]} nav={nav}  />}

                {/* <View style={{marginTop: -10}}></View> */}

                <LaunchCarousel content={recentlyLaunched} type="launch" nav={nav} />

                {/* Upcoming Launches */}
                <View style={[styles.contentSection]}>
                  <TouchableOpacity onPress={()=>{nav.navigate('Launches', {data: launchData.upcoming,user: userData, title:"Upcoming Launches" })}}>
                    <View style={styles.contentHeaderSection} >
                        <Text style={styles.contentHeaderText} >Upcoming Launches</Text>
                        <View style={styles.seeMoreSection}>
                          <Text style={styles.contentSeeMore} >See All </Text>
                          <MaterialIcons 
                          name="arrow-forward-ios" 
                          style={styles.contentHeaderIcon} 
                          />
                        </View>
                    </View>
                  </TouchableOpacity>
                  
                  {upcomingFiltered.map((launch: any) => {
                  return (
                      <LaunchInfo key={launch.id} data={launch} />
                  );
                  })}
                </View>

                {upcomingEvents != undefined && upcomingEvents.length != 0 && 
                <View style={styles.sectionContainer}>
                    <TouchableOpacity onPress={() => {nav.navigate('Events', {data:upcomingEvents})}}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Upcoming Events</Text>
                            <View style={styles.seeMoreSection}>
                                <Text style={styles.seeMoreText}>See All</Text>
                                <MaterialIcons name="arrow-forward-ios" style={styles.sectionIcon}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {upcomingEvents != undefined && upcomingEvents.slice(0,2).map((item, index) => {return (<Event nav={nav} eventData={item} key={index}/>);})}        
                </View>
                }
                {previousEvents != undefined && previousEvents.length != 0 && 
                <View style={styles.sectionContainer}>
                    <TouchableOpacity onPress={() => {nav.navigate('Events', {data:previousEvents})}}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Events</Text>
                            <View style={styles.seeMoreSection}>
                                <Text style={styles.seeMoreText}>See All</Text>
                                <MaterialIcons name="arrow-forward-ios" style={styles.sectionIcon}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {previousEvents != undefined && previousEvents.slice(0,1).map((item, index) => {return (<Event nav={nav} eventData={item} key={index}/>);})}        
                </View>
                }

                <View style={[styles.buffer]}></View>

                {/* Show events here */}
                
                {/* <Pressable onPress={()=>props.data.setPage(4)}>
                  <View style={styles.newsHeaderSection} >
                      <Text style={styles.sectionHeaderText} >News & Events </Text>
            
                  </View>
                </Pressable> */}
                {/* Events */}
                {/* <View style={[styles.contentSection]}>
                  <TouchableOpacity onPress={()=>nav.navigate("All Events", {data: launchData.events, title:"Events" })}>
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
                  </TouchableOpacity>
                  {events.map((launch: any) => {
                  return (
                      <Event key={launch.id} eventData={launch} nav={nav} />
                  );
                  })} 
                </View>
                
                <View style={[styles.contentSection]}>
                  <TouchableOpacity onPress={()=>nav.navigate("All News", {data: launchData.news, title:"Articles" })}>
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
                  </TouchableOpacity>
                
                      {news.map((launch: any) => {
                      // console.log(launch)
                      return (

                          <Article key={launch.id} articleData={launch}  />
                      );
                  })}
                </View> */}
                
                
                {/* <View style={[styles.buffer]}></View> */}
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

      elevation: 10,
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

    sectionContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',


        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 15,
        // width: '100%',
        marginTop: 10,
        // marginBottom: 10,
        marginHorizontal: 10,
        
    },
    eventsTitle:{
        fontSize: 22,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'center',
        // marginBottom: 10,
        marginLeft: 12,
        marginTop: 10,
    },
    eventsContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',


        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 15,
        marginTop: 10,
        marginHorizontal    : 10,
        marginBottom: 10,
        
    },
    // SECTION HEADERS
    sectionHeader:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 3,
        // marginBottom: 5,
        marginTop: 5,
    },
    sectionTitle:{
        fontSize: 24,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        // marginBottom: 10,
        marginLeft: 10,
    },
    seeMoreText:{
        fontSize: 18,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
        marginRight: 10,
        alignContent: 'flex-end',
    },
    sectionIcon:{
        fontSize: 25,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
        marginRight: 10,
    },
});