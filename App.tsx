import { useFonts } from "expo-font";
import { SpaceGrotesk_500Medium } from "@expo-google-fonts/space-grotesk";

import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import TestLaunchData from "./components/pages/TestLaunchData";
import Dashboard from "./components/pages/Dashboard";
import Launches from "./components/pages/Launches";
import MenuBar from "./components/styled/MenuBar";
import Loading from "./components/styled/Loading";

import UserData from "./components/data/UserData";

import * as colors from "./components/styles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TitleBar from "./components/styled/Titlebar";
import PagerView from "react-native-pager-view";
import ForYou from "./components/pages/ForYou";

export default function App() {
  // App Data Variables
  let [userData, setUserData] = useState(null);
  let [immersive, setImmersive] = useState(false);
  let [launchData, setLaunchData]= useState(null)
  let [pinnedLaunches, setPinnedLaunches] = useState([])
  let currentPage = useRef(0);
  const pagerRef = useRef(null);

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
      console.log("Data ", launchData)
      setPinnedLaunches(data.pinned)
    }).catch((error)=>{
      console.log("Error Fetching Data", error)
    })
  }

  // Reload function called with pull down reload gesture
  async function reloadData(userData){

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

  // Called when the page is changed
  const onPageSelected = (event) => {
    // Handle page selection
    const { position } = event.nativeEvent;

    // console.log('Page changed to:', position);
    currentPage.current = position;
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
        refresh: fetchData,
      };
      return (
        <PagerView 
          style={styles.pagerView} 
          initialPage={currentPage.current} 
          orientation="horizontal" 
          ref={pagerRef} 
          onPageScrollStateChanged={onPageScrollStateChanged}
          onPageSelected={onPageSelected}
        >
            <ForYou data = {data}/>
            <Dashboard data={data} />
            <Launches data={data} />
        </PagerView>
      )
    }
  }

  // Main App View
  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <StatusBar style="light" />
        <TitleBar immersive={immersive} setImmersive={setImmersive} />
        <CurrentPage/>
        <MenuBar page={null} setPage={setPage} />
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
