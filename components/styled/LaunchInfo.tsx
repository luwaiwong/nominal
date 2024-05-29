import { StyleSheet, View, Text, Image, Animated } from "react-native";
import React, { useRef } from "react";
import { useState } from "react";
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import * as colors from "../styles";
import UserData from "../data/UserData";
import { GestureDetector, Gesture} from "react-native-gesture-handler";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export default function TestLaunchData(data) {
  let launchInfo = data.data;  
  let userData = data.user;
  let [launchTime, setLaunchTime] = useState<any>(new Date(launchInfo.net));
  let [pinned, setPinned] = useState<any>(userData.getPinned().includes(launchInfo.id));
  const togglePinned = () => {
    let pinnedStatus = userData.togglePinned(launchInfo.id)
    setPinned(pinnedStatus);

  };

  // ANIMATIONS
  const scale = useRef(new Animated.Value(1)).current;
  // Create an animation that scales the view to 1.2 times its original size when pressed
  const animateIn = () => {
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 200,
      useNativeDriver: true, // Add this to improve performance
    }).start();
  };

  // Create an animation that scales the view back to its original size when released
  const animateOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true, // Add this to improve performance
    }).start();
  };

  const toggle = () => {
    togglePinned()
    Animated.sequence([
    Animated.timing(scale, {
      toValue: 0.8,
      duration: 150,
      delay:100,
      useNativeDriver: true, // Add this to improve performance
    }),Animated.timing(scale, {
      toValue: 1,
      duration: 150,
      delay:100,
      useNativeDriver: true, // Add this to improve performance
    })]).start()
  }

  // Gestures
  const tap = Gesture.Tap();

  tap.onTouchesDown(()=>animateIn());
  tap.onTouchesUp(()=>animateOut());
  // tap.onTouchesMove(()=>animateIn());
  tap.onTouchesCancelled(()=>animateOut());
  // tap.onEnd(()=>toggle()); // UNCOMMENT TO RESTORE PINNED
  tap.numberOfTaps(2);
  
  // Status name
  let status = launchInfo.status.name;
  if (status === "To Be Confirmed"){
    status = "TBC";
  }
  if (status === "To Be Determined"){
    status = "TBD";
  }
  else if (status === "Go for Launch"){
    status = "Go for Launch";
  }
  else if (status === "Launch Successful"){
    status = "Launched";
  }

  let tminus = calculateTminus(launchInfo.net, status);
  if (status === "TBC" || status === "TBD"){
    tminus = "T "+tminus;
  }
  else {
    tminus = "T "+tminus;
  }
  
  // HTML
  return (
    <GestureDetector gesture={tap} >
      
      <Animated.View style={[styles.background, {transform:[{scale}]}]}>
        {/* Header, Holds the title and t -  countdown */}
        <View style={styles.headerSection}>
          <Text style={styles.titleText} >{launchInfo.mission.name} </Text>
        </View>
        {/* Body, Holds the launch info on left and image on right */}
        <View style={styles.bodySection}>
          <View style={styles.infoSection}>
            <View style={styles.horizontalInfoContainer}>
                <Text style={styles.smallText}>{status}</Text>
                <Text style={styles.smallText}>{tminus}</Text>
            </View>
            <View style={styles.smallSpacer}></View>
            <Text style={styles.smallText}>{launchInfo.launch_provider.name}</Text>
            <Text style={styles.smallText}>{launchInfo.rocket.configuration.full_name}</Text>
            <Text style={styles.smallText}>{launchInfo.launch_pad.name}</Text>
            <View style={styles.smallSpacer}></View>
            <Text style={styles.mediumText}>{DAYS[launchTime.getDay()]+" "+MONTHS[launchTime.getMonth()]+" "+launchTime.getDate()+ ", "+launchTime.getFullYear()}</Text>
          </View>
          {/* Pinned Icon */}
          {/* {pinned ? 
            <MaterialCommunityIcons name="bell-ring"  style={styles.notificationIconActive}  /> : 
            <MaterialCommunityIcons name="bell-outline"  style={styles.notificationIcon}  />} */}
          <Image style={styles.image} source={{uri: launchInfo.image}} /> 
        </View>
      </Animated.View>
    </GestureDetector>
  );

}

function calculateTminus(launchTime: Date, status: string = "TBC"){
  let currentTime = new Date();
  let launchDate = new Date(launchTime);
  let timeDifference = launchDate.getTime() - currentTime.getTime();
  let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  let prefix = "- ";
  if (status === "TBC" || status === "TBD"){
    prefix = "~ ";
  }


  if (minutes < 0){
    return "+ " + Math.abs(minutes) + "m ";
  }
  if (days <= 0 && hours <= 0){
    return prefix+ minutes + "m ";
  }
  if (days <= 0){
    return prefix+hours + "h, " + minutes + "m ";
  }
  
  return prefix+days + "d, " + hours + "h ";
}

const styles = StyleSheet.create({
// Sections
background: {
  marginLeft: 10,
  marginRight: 10,
  height: 200,
  overflow: 'hidden',
  marginBottom: 10,
  padding: 5,
  borderRadius: 10,

  backgroundColor: colors.BACKGROUND_HIGHLIGHT,
  
},
headerSection:{
  height: 35,
},
bodySection:{
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: 150,
  justifyContent: 'space-between',
  
},
infoSection:{
  flex: 1,
  paddingRight: 10,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',

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
horizontalInfoContainer:{
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  // backgroundColor: colors.FOREGROUND,

},
smallerText:{
  fontSize: 14,
  color: colors.FOREGROUND,
    fontFamily: colors.FONT,

},
smallText: {
  fontSize: 16,
  color: colors.FOREGROUND,
    fontFamily: colors.FONT,
},
mediumText:{
  fontSize: 18,
  color: colors.FOREGROUND,

    fontFamily: colors.FONT,
},
LargeText:{
  fontSize: 20,
  color: colors.FOREGROUND,

    fontFamily: colors.FONT,
},

smallSpacer:{
  height: 5,

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