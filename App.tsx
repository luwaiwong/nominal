import { useFonts } from "expo-font";
import { SpaceGrotesk_500Medium } from "@expo-google-fonts/space-grotesk";

import { AppState, Dimensions, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, Animated, Alert } from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import PagerView from "react-native-pager-view";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Components\
import TitleBar from "./components/styled/Titlebar";
import MenuBar from "./components/styled/MenuBar";
import Loading from "./components/styled/Loading";

// Pages
import Settings from "./components/pages/Settings"
import Launches from "./components/pages/Launches";
import ForYou from "./components/pages/ForYou";
import Dashboard from "./components/pages/Dashboard";
import News from "./components/pages/News"


import * as colors from "./components/styles";
import { useSharedValue } from "react-native-reanimated";
import { UserContext } from "./components/data/UserContext";
import Locations from "./components/pages/More";


const titleOffset = 300

export default function App(props) {
  // App Data Variables
  let userContext = useContext(UserContext);
  let appState = useRef(AppState.currentState);
  let [launchData, setLaunchData]= useState(null)
  let currentPage = useRef(0);
  let menuBarRef = useRef(null);

  let lastReload = useRef(0);
  
  const pagerRef = useRef(null);
  const pageScrollState = useSharedValue(titleOffset);

  const refreshOpacity = useRef(new Animated.Value(0)).current

  const startRefreshAnimation = () => {Animated.loop(
      Animated.sequence([
        Animated.timing(
          refreshOpacity,
          {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
            delay: 0,
          }
        ),
        Animated.timing(
          refreshOpacity,
          {
            toValue: 0,
            duration: 750,
            useNativeDriver: true,
            delay: 0,
          }
        )
      ])
    ).start()
  }

  // Subscribe and check app state
  useEffect(()=>{
    if (userContext == null){
      return;
    }

    if (!userContext.settings.reloadonfocused){
      return;
    }

    const subscription = AppState.addEventListener("change", nextAppState => {
      console.log("App State", appState.current, nextAppState)
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("App focused")
        try {
          reloadData(true)
        } catch(e){
          Alert.alert("Error when reloading data", "Error "+ e);
        }
      }
      else {
      }
        appState.current = nextAppState;
    })

    return () => {
      subscription.remove();
    }
  }, [userContext])

  // Called whenever userContext is updated
  useEffect(() => {
    if (userContext == null){
      return;
    }


    // Load User Context
    userContext.nav = props.navigation;
    userContext.setPage = setPage;

    // Check first load
    checkFirstLoad();

    fetchData(userContext);

  }, [userContext]);
  

  async function checkFirstLoad(){
    if (userContext == null){
      return;
    }

    let firstLoad = await userContext.checkFirstLoad();
    console.log("First Load", firstLoad)
    if (firstLoad){
      userContext.nav.navigate("First Load");
    }
  }

  // Function to fetch data
  async function fetchData(userContext) {
    lastReload.current = Date.now();
    console.log("Fetching Data");
    await userContext.getData().then((data)=> {
      console.log("Returning Data")
      if (data == null){
        console.log("Data is null")
        return true;
      }

      if (JSON.stringify(data) == JSON.stringify(launchData)){
        console.log("Data is the same, don't update")
        return true;
      }

      setLaunchData(data);
    }).catch((error)=>{
      Alert.alert("Error getting data: "+ error);
      return false;
    })
  }

  // Reload function called with pull down reload gesture
  async function reloadData(isPageLoad=false){
    if (isPageLoad && lastReload.current - 1000*60*30 < Date.now()){
      return;
    }
    if (userContext == undefined || userContext.gettingdata){
      return;
    }

    lastReload.current = Date.now();

    startRefreshAnimation();
    console.log("Refreshing Page")
    await userContext.reloadData().then((data)=> {
      console.log("Returning Data")
      refreshOpacity.setValue(0);
      
      if (data == null){
        return true;
      }

      if (JSON.stringify(data) == JSON.stringify(launchData)){
        return true;
      }

      setLaunchData(data);
      return true;
    }).catch((error)=>{
      Alert.alert("Error getting data"+ error);
      refreshOpacity.setValue(0);
      return false;
    })
  }

  // Checks if font is loaded, if the font is not loaded yet, just show a loading screen
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_500Medium,
  });
  if (!fontsLoaded || userContext == null) {
    return <Loading />;
  }

  // Page Change Handling
  // Use to change current page when button pressed
  function setPage(page){
    if (pagerRef.current != null){
      pagerRef.current.setPage(page);
    }
  }

  // Called when the page is scrolling
  // Use to handle animations while page is scrolling (e.g. bottom sliding animation)
  const onPageScrollStateChanged = (state) => {
    // Handle page scroll state changes (e.g., idle, settling, dragging)
    // Example: Log the state change
    // console.log('Page scroll state:', state);
    // Can be 
  };

  const onPageScroll = (state) => {
    // Handle page scroll state changes (e.g., idle, settling, dragging)
    // Example: Log the state change
    // console.log('Page scroll state:', state["nativeEvent"]);
    pageScrollState.value = (state["nativeEvent"]["offset"]+state["nativeEvent"]["position"]) * -150 + titleOffset;
    // Can be 
  }
  // Called when the page is changed
  const onPageSelected = (event) => {
    // Handle page selection
    const { position } = event.nativeEvent;

    // console.log('Page changed to:', position);
    currentPage.current = position;

    if (menuBarRef.current != null){
      menuBarRef.current.updatePage();
    }

  };

  // Returns current page
  function CurrentPage(){
    // Data object fed into all pages
    // Includes current state of app
    let data = {
      reloadData: reloadData,
      nav: props.navigation,
      setPage: setPage,
    };
    return (
      <PagerView 
        style={styles.pagerView} 
        initialPage={currentPage.current} 
        orientation="horizontal" 
        ref={pagerRef} 
        onPageScrollStateChanged={onPageScrollStateChanged}
        onPageScroll={onPageScroll}
        onPageSelected={onPageSelected}
      >
        <ForYou data={data}/>
        <Dashboard data={data}/>
        <Launches data={data}/>
        <News data={data}/>
        {/* <Locations data={data}/> */}
        <Settings />
      </PagerView>
    )
    
  }

  // Main App View
  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <StatusBar style="light" />
        <TitleBar scrollState={pageScrollState}/>
        <CurrentPage/>
        <MenuBar page={currentPage} setPage={setPage} ref={menuBarRef} />
        <View pointerEvents='none' style={styles.reloadingDataIndicator}>
          <Animated.Text style={[styles.reloadingDataText, {opacity: refreshOpacity}]} >Refreshing Data...</Animated.Text>
        </View>
        
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BACKGROUND,
    width: "100%",
    height: "100%",
  },
  pagerView: {
    flex: 1,
    zIndex: 100,
  },
  reloadingDataIndicator:{
    position: "absolute",
    bottom: colors.BOTTOM_BAR_HEIGHT+50,
    // left: Dimensions.get("window").width/2-100,
    width: "100%",
    height: 5,
    // backgroundColor: colors.FOREGROUND,
    zIndex: 100000,
  },
  reloadingDataText:{
    position: "absolute",
    // bottom: colors.BOTTOM_BAR_HEIGHT+ 20,

    backgroundColor: colors.BACKGROUND_HIGHLIGHT,
    width: 200,
    // height: 50,
    fontSize: 20,

    borderRadius: 15,
    paddingVertical: 5,

    marginLeft: Dimensions.get("window").width/2-100,
    // width: "100%",
    textAlign: "center",
    color: colors.FOREGROUND,
    fontFamily: colors.FONT,
    zIndex: 10000,
  }

});
