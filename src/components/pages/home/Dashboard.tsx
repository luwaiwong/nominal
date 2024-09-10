import { StyleSheet, View, Text, ScrollView, RefreshControl, StatusBar, Dimensions, Pressable, TouchableHighlight } from "react-native";
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';

import {COLORS, FONT, TOP_BAR_HEIGHT,BOTTOM_BAR_HEIGHT}from "../../../constants/styles";
import HighlightLaunch from "../../styled/HighlightLaunch";
import LaunchInfo from "../../styled/LaunchSimple";
import Loading from "../../styled/Loading";
import Event from "../../styled/Event";
import Article from "../../styled/Article";
import LaunchCarousel from "./components/LaunchCarousel";
import { TouchableOpacity } from "react-native-gesture-handler";
import LaunchHighlight from "../../styled/HighlightLaunch";
import { UserContext } from "../../../utils/UserContext";
import { useUserStore } from "../../../utils/UserStore";


export default function Dashboard(props) {
  const upcomingLaunches = useUserStore((state)=>state.upcomingLaunches)
  const userContext = useContext(UserContext);

  const [refreshing, setRefreshing] = useState(false)
  async function refreshData(){
    setRefreshing(true)
    await props.data.reloadData().then((data)=> {
      console.log("Finishing Refresh")
      setRefreshing(false)
    })
  }
  
  useEffect(()=>{

  }, [])
  

  // Check if data is loaded
  if (userContext === undefined){
    console.log("Launches Undefined")
    return <Loading/>
  }

  // All data
  let upcoming = userContext.launches.upcoming
  let recentlyLaunched = userContext.launches.previous.slice(0,5)
  let upcomingFiltered = null
  // calculate upcoming filtered
  upcomingFiltered = userContext.launches.upcoming.slice(0, 3);
  let highlights = [userContext.launches.upcoming[0]]


  let nav = props.data.nav


  
    
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
                {highlights[0] != undefined &&
                <View style={{marginHorizontal: 10, marginBottom: 10}}>
                  <LaunchHighlight data={highlights[0]} nav={nav}  />
                </View> }

                <View style={{marginTop: -10}}></View>


                <LaunchCarousel content={recentlyLaunched} type="launch" nav={nav} />
                {/* Upcoming Launches */}
                <View style={[styles.contentSection]}>
                  <TouchableOpacity onPress={()=>{nav.navigate('Launches', {data: userContext.launches.upcoming, title:"Upcoming Launches" })}}>
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
                {/* <Text style={styles.sectionTitle}>Locations:</Text> */}
                {/* <View style={[styles.buffer]}></View> */}
                
                {/* <LiveChannels/> */}
                <View style={styles.bottomPadding}></View>
              </ScrollView>
          </View>
    );
      
  }

  return <Content/>;
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: "white"
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
      height: BOTTOM_BAR_HEIGHT-5,
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

      // elevation: 10,
    },
    contentHeaderSection: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    sectionHeaderText:{
      fontSize: 25,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      marginLeft: 10,
      marginTop: 5
    },
    contentHeaderText: {
      fontSize: 20,
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
        marginLeft: 20,
        marginTop: 15,
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