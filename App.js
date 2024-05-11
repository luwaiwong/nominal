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

export default function App() {
  // App State Variables
  let [userData, setUserData] = useState(null);
  let [immersive, setImmersive] = useState(false);
  let [upcomingLaunches, setUpcomingLaunches] = useState < any > [];
  let [previousLaunches, setPreviousLaunches] = useState < any > [];
  let [page, setPage] = useState("dashboard");

  // Called only once when the app is mounted
  useEffect(() => {
    console.log("App Mounted");
    // Create a new user data object
    // This way the user data isn't reset every time the app is re-rendered
    setUserData(new UserData());
    fetchData();
  }, []);

  // Function to fetch data
  async function fetchData() {
    await userData.getAllUpcomingLaunches().then((data) => {
      setUpcomingLaunches(data);
      setUpcomingLoading(false);
    });
    await userData.getPreviousLaunches().then((data) => {
      setPreviousLaunches(data);
      setPreviousLoading(false);
    });
  }

  const [fontsLoaded] = useFonts({
    SpaceGrotesk_500Medium,
  });
  if (!fontsLoaded || userData == null) {
    return <Loading />;
  }

  // Data object fed into all pages
  // Includes current state of app
  data = {
    userData: userData,
    immersive: immersive,
    upcoming: upcomingLaunches,
    previous: previousLaunches,
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <StatusBar style="light" />
        <TitleBar />
        {page == "dashboard" && <Dashboard data={data} />}
        {page == "launches" && <Launches data={data} />}
        <MenuBar page={page} setPage={setPage} />
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
});
