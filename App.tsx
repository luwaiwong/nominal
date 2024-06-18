import { useFonts } from "expo-font";
import { SpaceGrotesk_500Medium } from "@expo-google-fonts/space-grotesk";

import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import PagerView from "react-native-pager-view";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Components
import TestLaunchData from "./components/pages/TestLaunchData";
import TitleBar from "./components/styled/Titlebar";
import MenuBar from "./components/styled/MenuBar";
import Loading from "./components/styled/Loading";

// Pages
import Settings from "./components/pages/Settings"
import Launches from "./components/pages/Launches";
import ForYou from "./components/pages/ForYou";
import Dashboard from "./components/pages/Dashboard";
import News from "./components/pages/News"

import UserData from "./components/data/UserData";

import * as colors from "./components/styles";
import { useSharedValue } from "react-native-reanimated";

export default function App() {
  // App Data Variables
  let [userData, setUserData] = useState(null);
  let [immersive, setImmersive] = useState(false);
  let [launchData, setLaunchData]= useState(null)
  let [pinnedLaunches, setPinnedLaunches] = useState([])
  let currentPage = useRef(2);
  let menuBarRef = useRef(null);
  
  const pagerRef = useRef(null);

  const pageScrollState = useSharedValue(0);

  // Called only once when the app is mounted
  useEffect(() => {
    console.log("App Mounted");
    // Create a new user data object
    // This way the user data isn't reset every time the app is re-rendered
    let userData = new UserData();
    setUserData(userData)
    fetchData(userData);
  }, []);

  // Function to fetch data
  async function fetchData(userData) {
    console.log("Fetching Data");
    await userData.getData().then((data)=> {
      setLaunchData(data);
      setPinnedLaunches(data.pinned)
    }).catch((error)=>{
      console.log("Error Fetching Data", error)
    })
  }

  // Reload function called with pull down reload gesture
  async function reloadData(){
    console.log("Refreshing Page")
    await fetchData(userData).catch((error)=>{console.log("Error Reloading Page", error)})
  }

  // Checks if font is loaded, if the font is not loaded yet, just show a loading screen
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_500Medium,
  });
  if (!fontsLoaded || userData == null) {
    return <Loading />;
  }


  // Page Change Handling
  // Use to change current page when button pressed
  function setPage(page){
    console.log("Setting Page to:", page);
    pagerRef.current.setPage(page);

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
    pageScrollState.value = (state["nativeEvent"]["offset"]+state["nativeEvent"]["position"]) * -150 + 300;
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
    if (launchData == null) {
      return <Loading />;
    }
    else{
      // Data object fed into all pages
      // Includes current state of app
      let data = {
        userData: userData,
        immersive: immersive,
        launchData: launchData, 
        upcoming: launchData.upcoming,
        previous: launchData.previous,
        pinned: launchData.pinned,
        setPinned: setPinnedLaunches,
        reloadData: reloadData,
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
          <Settings/>
          <Launches data={data} />
          <ForYou data={data}/>
          <Dashboard data={data} />
          <News data={data}/>
        </PagerView>
      )
    }
  }

  // Main App View
  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <StatusBar style="light" />
        <TitleBar immersive={immersive} setImmersive={setImmersive} scrollState={pageScrollState}/>
        <CurrentPage/>
        <MenuBar page={currentPage} setPage={setPage} ref={menuBarRef} />
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

});
