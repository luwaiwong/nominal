import { StyleSheet, View, Text, Image } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import * as colors from "../styles";
import UserData from "../data/UserData";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export default function TestLaunchData(data) {
  let launchInfo = data.data;  
  let [launchTime, setLaunchTime] = useState<any>(new Date(launchInfo.net));
  let [pinned, setPinned] = useState<any>(data.user.pinned.includes(launchInfo.id));
  const togglePinned = () => {
    setPinned(data.user.togglePinned(launchInfo.id));
  };
  
  return (
    <View style={styles.background}>
      {/* Header, Holds the title and t -  countdown */}
      <View style={styles.headerSection}>
        <Text style={styles.titleText} onPress={()=>togglePinned()} >{launchInfo.mission.name} </Text>
        <View style={styles.timeSection}>
          <Text style={styles.timeText}>T - {calculateTminus(launchInfo.net)}</Text>
        </View>
      </View>
      {/* Body, Holds the launch info on left and image on right */}
      <View style={styles.bodySection}>
        <View style={styles.infoSection}>
          <Text style={styles.mediumText}>Status</Text>
          <Text style={styles.mediumText}>Rocket Name</Text>
          <Text style={styles.mediumText}>{DAYS[launchTime.getDay()]+" "+MONTHS[launchTime.getMonth()]+" "+launchTime.getDate()+ ", "+launchTime.getFullYear()}</Text>
          <Text style={styles.smallText}>{launchInfo.launch_provider.name}</Text>
        </View>
        {pinned ? 
          <MaterialCommunityIcons name="bell-ring"  style={styles.notificationIconActive} onPress={()=>togglePinned()} /> : 
          <MaterialCommunityIcons name="bell-outline"  style={styles.notificationIcon} onPress={()=>togglePinned()} />}
        <Image style={styles.image} source={{uri: launchInfo.image}} /> 
      </View>
    </View>
  );

}

function calculateTminus(launchTime: Date){
  let currentTime = new Date();
  let launchDate = new Date(launchTime);
  let timeDifference = launchDate.getTime() - currentTime.getTime();
  let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  if (days <= 0 && hours <= 0){
    return minutes + "m ";
  }
  if (days <= 0){
    return hours + "h, " + minutes + "m ";
  }
  
  return days + "d, " + hours + "h ";
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
    fontFamily: colors.FONT,
},
// Header Section Stuff
timeSection:{
  position: 'absolute', 
  right: 6,
  flex: 1,
  width: 500,
  height: 30,
  justifyContent: 'center',
    fontFamily: colors.FONT,
},
timeText: {
  position: 'absolute', 
  right: 0,
  color: colors.FOREGROUND,
  alignItems: 'center',
  justifyContent: 'center',
    fontFamily: colors.FONT,
},
titleText: {
    flex: 1,
    fontSize: 20,
    color: colors.FOREGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    fontFamily: colors.FONT,
},
// Info Section Stuff
smallText: {
  fontSize: 14,
  color: colors.FOREGROUND,
    fontFamily: colors.FONT,
},
mediumText:{
  fontSize: 16,
  color: colors.FOREGROUND,

    fontFamily: colors.FONT,
},
//
  notificationIcon:{
    position: 'absolute',
    top:6,
    right: 6,

    color: colors.FOREGROUND,
    fontSize: 28,
    zIndex: 1
  },
  notificationIconActive:{
    position: 'absolute',
    top:6,
    right: 6,
    transform: [{rotate: '20deg'}],

    color: colors.FOREGROUND,
    fontSize: 28,
    zIndex: 1
  },

});