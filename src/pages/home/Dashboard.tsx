import { StyleSheet, View, Text, ScrollView, RefreshControl, StatusBar, Dimensions, Pressable, TouchableHighlight } from "react-native";
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";

import Launch from "src/components/LaunchSmall";
import Loading, { LoadingView } from "src/components/Loading";
import Event from "src/components/Event";
import LaunchCarousel from "./components/LaunchCarousel";
import LaunchHighlight from "src/components/HighlightLaunch";

import { UserContext } from "../../utils/UserContext";
import { useUserStore } from "../../utils/UserStore";

import {COLORS, FONT, TOP_BAR_HEIGHT,BOTTOM_BAR_HEIGHT}from "../../styles";
import { EventItemList, LaunchItemList } from "./components/ItemListSection";


export default function Dashboard(props) {
  const nav = useUserStore((state)=>state.nav)
  const upcomingLaunches = useUserStore((state)=>state.upcomingLaunches)
  const previousLaunches = useUserStore((state)=>state.previousLaunches)
  const upcomingEvents = useUserStore((state)=>state.upcomingEvents)
  const previousEvents = useUserStore((state)=>state.previousEvents)

  // All data
  let upcomingLaunchFiltered = []
  let previousLaunchFiltered = []
  let upcomingEventFiltered = []
  let highlights = []

  // Upcoming Filtered
  upcomingLaunchFiltered = upcomingLaunches.slice(0, 3);
  // Previous
  previousLaunchFiltered = previousLaunches.slice(0,5)
  // Event
  upcomingEventFiltered = upcomingEvents.slice(0,3)
  // Highlights
  if (upcomingLaunches.length > 0) highlights=[...upcomingLaunches.slice(0, 1)]




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
              {/* <View style={styles.topPadding}/> */}
              
              {/* Scolling Area */}
              <ScrollView 
                // Refresh Control
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={()=>{refreshData()}
                  } colors={[COLORS.FOREGROUND]} progressBackgroundColor={COLORS.BACKGROUND_HIGHLIGHT}/>
                }
              >
                <View style={styles.topPadding}/>
                <View style={{height: 10}}/>
                {/* Highlight Launch */}
                {highlights != undefined && highlights[0] != undefined ?
                  <View style={{marginHorizontal: 10, marginBottom: 10}}>
                    <LaunchHighlight data={highlights[0]} nav={nav}  />
                  </View> :
                  <LoadingView style={styles.loadingHighlight}/>
                }

                <View style={{marginTop: -10}}></View>

                { (previousLaunchFiltered != undefined && previousLaunchFiltered.length != 0) ?
                  <LaunchCarousel content={previousLaunchFiltered} type="launch" nav={nav} /> :
                  <LoadingView style={styles.loadingCarousel}/>
                }

                {/* Upcoming Launches */}
                
                { (upcomingLaunchFiltered != undefined && upcomingLaunchFiltered.length != 0) ?
                  <LaunchItemList data={upcomingLaunchFiltered} title="Upcoming Launches"/> :
                  <LoadingView style={styles.loadingList}/>
                }
                
                { (upcomingEventFiltered != undefined && upcomingEventFiltered.length != 0) ?
                  <EventItemList data={upcomingEventFiltered} title="Upcoming Events" highlight={true}/>:
                  <LoadingView style={styles.loadingList}/>
                }
                
                {/* <View style={styles.bottomPadding}></View> */}
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
      backgroundColor: COLORS.BACKGROUND,

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
    sectionHeaderText:{
      fontSize: 25,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      marginLeft: 10,
      marginTop: 5
    },

    loadingHighlight:{
      width: Dimensions.get('window').width-20, 
      height: 300, 
      marginLeft: 10,
      backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
      marginBottom: 10,
      borderRadius: 15,
    },
    loadingCarousel:{
      width: Dimensions.get('window').width-20, 
      height: 200, 
      backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
      marginTop: 10,
      // marginBottom: 10,
      marginLeft: 10,
      borderRadius: 15,
    },
    loadingList:{
      width: Dimensions.get('window').width-20, 
      height: 400, 
      backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
      marginTop: 10,
      // marginBottom: 10,
      marginLeft: 10,
      borderRadius: 15,
    }
});