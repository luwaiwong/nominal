import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { useEffect, useState } from "react";

import LaunchInfo from "../styled/LaunchInfo";

import * as colors from "../styles";

export default function Loading() {

  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Header Bar Section
    topSection: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.BACKGROUND,
      padding: 10,
      height: 60,
    },
    titleText: {
      fontSize: 24,
      flex: 1,
      color: colors.FOREGROUND,
      // position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',

      fontFamily: "SpaceGrotesk_500Medium",
    },
    menuButton:{},
    immersiveButton:{},

    // Content Section
    contentSection: {
      display: 'flex',
      backgroundColor: colors.BACKGROUND,
      height: '100%',
    },
    contentHeader: {
      fontSize: 32,
      color: colors.FOREGROUND,
      
      marginLeft: 8,
      marginBottom: 10,
    },
});