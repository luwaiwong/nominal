import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { useEffect, useState } from "react";

import * as colors from "../colors";

export default function TestLaunchData(data) {
    let launchInfo = data.data; 

  return (
    <View>
        <Text style={styles.text}>{launchInfo.name}</Text>
    </View>
  );

}


const styles = StyleSheet.create({
text: {
    flex: 1,
    color: colors.FOREGROUND,
    alignItems: 'center',
    justifyContent: 'center',
},
});