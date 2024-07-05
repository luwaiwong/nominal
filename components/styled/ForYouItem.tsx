import { StyleSheet, View, Text, Image, StatusBar } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import {BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT} from "../styles";
import UserData from "../data/UserData";
import { BlurView } from "expo-blur";
// import { BlurView } from "@react-native-community/blur";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ForYouItem(data) {
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
          <View>
            <Text style={styles.title} onPress={()=>togglePinned()} >{launchInfo.mission.name} </Text>
          </View>

          <View>

         
            <BlurView  intensity={60} tint='dark' experimentalBlurMethod='dimezisBlurView'
              style={styles.infoSection}>
              <View>
                <Text style={styles.largeText}>{launchInfo.rocket.configuration.full_name}</Text>
                <Text style={styles.text}>{launchInfo.launch_provider.name}</Text>
              </View>
              <View>
                <Text style={styles.text}>{launchInfo.launch_pad.name}</Text>
                <Text style={styles.largeText}>{DAYS[launchTime.getDay()]+" "+MONTHS[launchTime.getMonth()]+" "+launchTime.getDate()+ ", "+launchTime.getFullYear()}</Text>
                <View style= {styles.tagsSecton}>
                  <Text style={styles.tag}>{launchInfo.mission.type}</Text>
                  <Text style={styles.tag}>{launchInfo.mission.orbit.name}</Text>
                </View>
              </View>

              
               <Text style={styles.timeText}>{("T ") + calculateTminus(launchTime)}</Text>
            </BlurView>

            {/* <Text style={styles.timeText}>{("T ") + calculateTminus(launchTime)}</Text> */}
          </View>
        </View>

    </View>
  );

}

function calculateTminus(launchTime: Date, status: string = "TBC"){
  let currentTime = new Date();
  let launchDate = new Date(launchTime);
  let timeDifference = launchDate.getTime() - currentTime.getTime();
  let days = (Math.floor(timeDifference / (1000 * 60 * 60 * 24)));
  let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  let prefix = "- ";
  if (status === "TBC" || status === "TBD"){
    prefix = "~ ";
  }

  
  return prefix+ formatNumber(days) + " : " + formatNumber(hours) + " : "  + formatNumber(minutes) 
}

function formatNumber(num: number){
  return ('0'+num.toString()).slice(-2)
}

const styles = StyleSheet.create({
    page:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: COLORS.BACKGROUND,
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
      paddingBottom: BOTTOM_BAR_HEIGHT,
      paddingTop: StatusBar.currentHeight+TOP_BAR_HEIGHT,
      
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      
    },
    infoSection:{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",

      // margin: "4%",
      margin: 10,
      borderRadius: 10,
      padding: 5,

      // width:"92%",
      height: 225,

      backgroundColor: 'rgba(52, 52, 52, 0.3)',

      overflow: "hidden",
      
    },
    title:{
      fontSize: 35,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "600",
      textAlign: "left",

      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: {width: 0, height: 1},
      textShadowRadius: 1,
      elevation: 200,
      
      marginHorizontal: "4%",
      width:"92%",

    },
    timeText:{
      fontSize: 30,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "center",

      // marginHorizontal: 10,
      // marginBottom: 10,
      // padding: 5,
      
      // backgroundColor: "rgba(30,30,30,0.8)",
      borderRadius: 15,

      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: {width: 0, height: 1},
      textShadowRadius: 1,
      elevation: 200,
    },
    statusText:{
      fontSize: 25,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",

      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: {width: 0, height: 1},
      textShadowRadius: 1,
      elevation: 200,
    },
    smallText:{
      fontSize: 12,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
    },
    text:{
      fontSize: 20,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
    },
    largeText:{
      fontSize: 25,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
    
    },
    tagsSecton:{
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      width: "100%",

      marginTop: 5,
    },
    tag:{
      fontSize: 16,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
      backgroundColor: COLORS.ACCENT,
      borderRadius: 10,

      marginRight: 5,
      marginTop: 2,
      marginBottom: 2,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    
});