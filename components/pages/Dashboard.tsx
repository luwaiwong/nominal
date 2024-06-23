import { StyleSheet, View, Text, ScrollView, RefreshControl, StatusBar, Dimensions } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';

import {COLORS, FONT, TOP_BAR_HEIGHT,BOTTOM_BAR_HEIGHT}from "../styles";
import HighlightLaunch from "../styled/HighlightLaunch";
import LaunchInfo from "../styled/Launch";
import Loading from "../styled/Loading";
import Event from "../styled/Event";
import Article from "../styled/Article";
import PagerView from "react-native-pager-view";


export default function Dashboard(props) {
  let userData = props.data.userData;

  let launchData = props.data.launchData
  let recentlyLaunched = launchData.dashboardRecent
  let upcomingFiltered = launchData.dashboardFiltered
  let highlights = launchData.dashboardHighlights

  let events = props.data.launchData.dashboardEvents
  let news = props.data.launchData.dashboardNews


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
                    {highlights[0] != undefined && <HighlightLaunch data={highlights[0]}  />}

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
                    
                    <View style={[styles.contentSection]}>

                      <View style={styles.contentHeaderSection} >
                          <Text style={styles.contentHeaderText} >Recent </Text>

                          <View style={styles.seeMoreSection}>
                            <Text style={styles.contentSeeMore} >See All </Text>
                            <MaterialIcons 
                            name="arrow-forward-ios" 
                            style={styles.contentHeaderIcon} 
                            />

                          </View>
                      </View>
                    <PagerView style={{height: 200}} initialPage={0}>
                        {recentlyLaunched.map((launch: any) => {
                        return (
                            <LaunchInfo key={launch.id} data={launch} user={userData}/>
                        );
                    })}

                    </PagerView>
                    </View>

                    {/* Upcoming Launches */}
                    <View style={[styles.contentSection]}>

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
                      {upcomingFiltered.map((launch: any) => {
                      return (
                          <LaunchInfo key={launch.id} data={launch} user={userData} />
                      );
                      })}
                    </View>



                    {/* Show events here */}

                    <View style={styles.newsHeaderSection} >
                        <Text style={styles.contentHeaderText} >Events </Text>
                        
                          <View style={styles.seeMoreSection}>
                            <Text style={styles.contentSeeMore} >See All </Text>
                            <MaterialIcons 
                            name="arrow-forward-ios" 
                            style={styles.contentHeaderIcon} 
                            />

                          </View>
                    </View>
                    {/* Events */}
                    <View style={[styles.contentSection]}>
                        {events.map((launch: any) => {
                        return (
                            <Event key={launch.id} eventData={launch}  />
                        );
                    })}
                    </View>
                    
                    
                    <View style={styles.newsHeaderSection} >
                        <Text style={styles.contentHeaderText} >Articles </Text>
                        
                        <View style={styles.seeMoreSection}>
                          <Text style={styles.contentSeeMore} >See All </Text>
                          <MaterialIcons 
                          name="arrow-forward-ios" 
                          style={styles.contentHeaderIcon} 
                          />

                        </View>
                    </View>
                    {/* Events */}
                    <View style={[styles.contentSection]}>
                        {news.map((launch: any) => {
                        return (
                            <Article key={launch.id} articleData={launch}  />
                        );
                    })}
                    </View>
                    
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
      height: Dimensions.get('window').height,
      // paddingBottom : BOTTOM_BAR_HEIGHT,
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
      marginBottom: 10,
      overflow: 'hidden',
    },
    contentHeaderSection: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    contentHeaderText: {
      fontSize: 25,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,


      
      marginLeft: 12,
      // marginBottom: 5,
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
      alignItems: 'flex-end',
      justifyContent: 'space-between',
     marginHorizontal: 10,
    },

    bottomBuffer:{
        height: BOTTOM_BAR_HEIGHT+140,
    }
});