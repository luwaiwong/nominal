import { StyleSheet, View, Text, Image, StatusBar } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import * as colors from "../styles";
import UserData from "../data/UserData";
import { SafeAreaView } from "react-native-safe-area-context";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export default function ImmersivePage(data) {
  let launchInfo = data.data;  
  let [launchTime, setLaunchTime] = useState<any>(new Date(launchInfo.net));
  let [pinned, setPinned] = useState<any>(data.user.pinned.includes(launchInfo.id));
  const togglePinned = () => {
    setPinned(data.user.togglePinned(launchInfo.id));
  };
  
  return (
    <View style={styles.page}>
        <Image style={styles.image} source={{uri: launchInfo.image}} />
        <View style={styles.contentContainer}>
          <Text style={styles.title} onPress={()=>togglePinned()} >{launchInfo.mission.name} </Text>
          <View style={styles.infoSection}></View>
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

  if (minutes < 0){
    return "+ " + Math.abs(minutes) + "m ";
  }
  if (days <= 0 && hours <= 0){
    return "-"+ minutes + "m ";
  }
  if (days <= 0){
    return "-"+hours + "h, " + minutes + "m ";
  }
  
  return "-"+days + "d, " + hours + "h ";
}

const styles = StyleSheet.create({
    page:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: colors.BACKGROUND,
        width: "100%",
        height: "100%",
    },
    image:{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "110%",
    },
    contentContainer:{
      width:"100%",
      height: "100%",
      padding: 10,
        paddingTop: StatusBar.currentHeight+colors.TOP_BAR_HEIGHT
    },
    title:{
        fontSize: 30,
        color: colors.FOREGROUND,
        fontFamily: colors.FONT,
    },
    infoSection:{
      display: "flex",
      position: "absolute",
      bottom: 0,

      width:"100%",
      height: "25%",

      backgroundColor: "black"
    }
});