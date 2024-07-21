import { StyleSheet, View, Text, Image, Animated, Pressable, TouchableOpacity } from "react-native";
import React, { useContext, useRef } from "react";
import { useState } from "react";
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import { UserContext } from "../data/UserContext";

import * as colors from "../styles";
import { COLORS } from "../styles";
import { GestureDetector, Gesture} from "react-native-gesture-handler";


const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function LaunchSimple(data: {data: any}) {
  let userContext = useContext(UserContext)
  let launch = data.data;  
  let [launchTime, setLaunchTime] = useState<any>(new Date(launch.net));

  
  const isPrecise = launch.net_precision.name === "Hour" || launch.net_precision.name === "Minute" || launch.net_precision.name === "Day"|| launch.net_precision.name === "Second";
  // let [pinned, setPinned] = useState<any>(userData.getPinned().includes(launchInfo.id));
  // const togglePinned = () => {
  //   let pinnedStatus = userData.togglePinned(launchInfo.id)
  //   setPinned(pinnedStatus);

  // };

  
    // let status = "Upcoming Launch";
    let statusColor = 'rgba(0,0,0,0)';
    // Set Status for Time
    if (launchTime.getTime() < Date.now()) {
        // status = "Launched";
    }
    // Check Status for Launch
    if (launch.status.id === 4) {
        // status = "Failed Launch";
        statusColor = COLORS.RED;
    }   else if (launch.status.id === 7) {
        // status = "Partial Failure";
        statusColor = COLORS.YELLOW;
    }  

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
    // togglePinned()
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
  const doubletap = Gesture.Tap();
  const singletap = Gesture.Tap();

  doubletap.onTouchesDown(()=>animateIn());
  doubletap.onTouchesUp(()=>animateOut());
  doubletap.onTouchesMove(()=>animateIn());
  doubletap.onTouchesCancelled(()=>animateOut());
  doubletap.onStart(()=>toggle());
  doubletap.numberOfTaps(2);

  singletap.numberOfTaps(1);
  singletap.onEnd(()=>{});
  
  // Status name
  let status = launch.status.name;

  let tminus = calculateTminus(launch.net, status);
  tminus = "T "+tminus;
  
  // HTML
  return (
      // <GestureDetector gesture={Gesture.Exclusive(doubletap, singletap)} >
      <TouchableOpacity onPress={()=> userContext.nav.navigate("Launch", {data: launch})}>
          <Animated.View style={[styles.background, {transform:[{scale}]}]} collapsable={false}>
            {/* Header, Holds the title and t -  countdown */}
            {/* Body, Holds the launch info on left and image on right */}
            <View style={styles.bodySection}>
              <View style={styles.infoSection}>

                <Text style={[styles.titleText]} numberOfLines={1}>{launch.mission.name} </Text>
            
                {
                  isPrecise ? <Text style={styles.smallText}>{tminus}</Text> : <Text style={styles.smallText}>{status}</Text>
                }

                <View style={styles.smallSpacer}></View>
                <Text style={styles.smallText}>{launch.rocket.configuration.full_name}</Text>
                <Text style={styles.smallText} numberOfLines={1}>{launch.launch_provider.name}</Text>
                {/* <Text style={styles.smallText} numberOfLines={1}>{launchInfo.launch_pad.name}</Text> */}
                <View style={styles.smallSpacer}></View>

                { isPrecise ? 
                  <Text style={styles.mediumText}>{launchTime.toLocaleString([],{
                      hour: '2-digit',
                      minute: '2-digit',
                      month: 'short',
                      day: 'numeric',
                      weekday:'long'})}</Text>
                  : 
                  <Text style={styles.mediumText}>NET {MONTHS[launchTime.getMonth()]+" "+launchTime.getDate()+ ", "+launchTime.getFullYear()}</Text> 
                  }
                
              </View>
              {/* Pinned Icon */}
              {/* {pinned ? 
                <MaterialCommunityIcons name="bell-ring"  style={styles.notificationIconActive}  /> : 
                <MaterialCommunityIcons name="bell-outline"  style={styles.notificationIcon}  />} */}
              <Image style={[styles.image,{borderColor: statusColor}]} source={{uri: launch.image}} /> 
            </View>
          </Animated.View>
      </TouchableOpacity>


  );

}

function calculateTminus(launchTime: Date, status: string = "TBC"){
  let currentTime = new Date();
  let launchDate = new Date(launchTime);
  let timeDifference = launchDate.getTime() - currentTime.getTime();
  let isnegative = false;

  if (timeDifference < 0){
    timeDifference = currentTime.getTime() - launchDate.getTime();
    isnegative = true;
  }

  let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  let prefix = "- ";
  if (status === "TBC" || status === "TBD"){
    prefix = "~ ";
  }
  if (isnegative){
    prefix = "+ ";
  }

  if (days <= 0 && hours <= 0){
    return prefix+ minutes + " minutes ";
  }
  if (days <= 0){
    return prefix+hours + " hours, " + minutes + " min ";
  }
  if (days == 1){
    return prefix+days + " day, " + hours + " hours ";
  }
  
  return prefix+days + " days, " + hours + " hours ";
}

const styles = StyleSheet.create({
// Sections
background: {
  marginLeft: 8,
  marginRight: 8,
  height: 150,
  overflow: 'hidden',
  marginBottom: 10,
  padding: 5,
  borderRadius: 10,

  backgroundColor: colors.BACKGROUND_HIGHLIGHT,
  zIndex: 1000,

  // elevation: 5,
  
},
headerSection:{
  height: 35,
},
bodySection:{
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: 140,
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
  width: 140,
  height: 140,
  borderRadius: 10,
  borderWidth: 2,
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
    // flex: 1,
    fontSize: 18,
    color: colors.FOREGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // height: 30,
    fontFamily: colors.FONT,
    marginBottom: 5,
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
  fontSize: 14,
  color: colors.FOREGROUND,
    fontFamily: colors.FONT,
},
mediumText:{
  fontSize: 14,
  color: colors.FOREGROUND,

    fontFamily: colors.FONT,
},
LargeText:{
  fontSize: 18,
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