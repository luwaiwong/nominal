import { StyleSheet, View, Text, Image } from "react-native";
import React from "react";
import { useEffect, useState } from "react";

import * as colors from "../styles";

export default function TestLaunchData(data) {
    let launchInfo = data.data;  
  let [launchTime, setLaunchTime] = useState<any>([]);
  useEffect(() => {
    async function calculateTminus() {
      console.log(launchInfo.net);
    }
    calculateTminus();
  }, []);
  return (
    <View style={styles.background}>
      {/* Header, Holds the title and t -  countdown */}
      <View style={styles.headerSection}>
        <Text style={styles.titleText}>{launchInfo.mission.name}</Text>
        <View style={styles.timeSection}>
          <Text style={styles.timeText}>T - 000000</Text>
        </View>
      </View>
      {/* Body, Holds the launch info on left and image on right */}
      <View style={styles.bodySection}>
        <View style={styles.infoSection}>
          <Text style={styles.mediumText}>Status</Text>
          <Text style={styles.mediumText}>Rocket Name</Text>
          <Text style={styles.mediumText}>Date</Text>
          <Text style={styles.smallText}>{launchInfo.launch_provider.name}</Text>
        </View>
        <Image style={styles.image} source={{uri: launchInfo.image}} /> 
      </View>
    </View>
  );

}


const styles = StyleSheet.create({
// Sections
background: {
  marginLeft: 10,
  marginRight: 10,
  height: 200,
  marginBottom: 10,
},
headerSection:{
  height: 35,
},
bodySection:{
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
  justifyContent: 'space-between',
  
},
infoSection:{
  width: '50%',
},
image: {
  width: 150,
  height: 150,
  borderRadius: 10,
},
text: {
    flex: 1,
    color: colors.FOREGROUND,
    alignItems: 'center',
    justifyContent: 'center',
},
// Header Section Stuff
timeSection:{
  position: 'absolute', 
  right: 6,
  flex: 1,
  width: 500,
  height: 30,
  justifyContent: 'center',
},
timeText: {
  position: 'absolute', 
  right: 0,
  color: colors.FOREGROUND,
  alignItems: 'center',
  justifyContent: 'center',
},
titleText: {
    flex: 1,
    fontSize: 20,
    color: colors.FOREGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
},
// Info Section Stuff
smallText: {
  fontSize: 14,
  color: colors.FOREGROUND,
},
mediumText:{
  fontSize: 16,
  color: colors.FOREGROUND,

}
});