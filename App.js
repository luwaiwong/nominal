import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

import TestLaunchData from "./components/pages/TestLaunchData";
import Dashboard from "./components/pages/Dashboard";

import UserData from "./components/data/UserData";

import * as colors from "./components/colors";

export default function App() {
  let userData = new UserData();

  return (
    <View style={styles.container}>
      <Dashboard data={userData} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BACKGROUND,
    width: "100%",
    height: "100%",
  },
});
