import { useFonts } from "expo-font";
import { SpaceGrotesk_500Medium } from "@expo-google-fonts/space-grotesk";

import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import TestLaunchData from "./components/pages/TestLaunchData";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import MenuBar from "./components/styled/MenuBar";
import Loading from "./components/pages/Loading";

import UserData from "./components/data/UserData";

import * as colors from "./components/styles";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  let userData = new UserData();
  let [page, setPage] = useState("dashboard");

  const [fontsLoaded] = useFonts({
    SpaceGrotesk_500Medium,
  });
  if (!fontsLoaded) {
    return <Loading />;
  }
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        {page == "dashboard" && <Dashboard data={userData} />}
        <MenuBar page={page} setPage={setPage} />
      </SafeAreaView>
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
