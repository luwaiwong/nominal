import { StyleSheet, View, Text, Image, StatusBar, Dimensions, FlatList, Pressable } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import {BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT} from "../styles";
import { BlurView } from "expo-blur";
import TMinus from "./TMinus";
import Article from "./Article";
import ArticleDescriptive from "./ArticleDescriptive";
// import { BlurView } from "@react-native-community/blur";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ForYouLaunch(data) {
  let launchInfo = data.data;  
  let [launchTime, setLaunchTime] = useState<any>(new Date(launchInfo.net));
  let [pinned, setPinned] = useState<any>(data.user.pinned.includes(launchInfo.id));
  const togglePinned = () => {
    setPinned(data.user.togglePinned(launchInfo.id));
  };
  
  let status = "Upcoming Launch";

  // Set Status
  if (launchTime.getTime() < Date.now()) {
      status = "Just Launched";
  }
  return (
    <Pressable onPress={()=>data.nav.navigate("Launch", {data: launchInfo})}>
    <View style={styles.page}>
        <Image style={styles.image} source={{uri: launchInfo.image}} />
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.title} numberOfLines={1} onPress={()=>togglePinned()} >{launchInfo.mission.name} </Text>
            <Text style={styles.subtitle} numberOfLines={1} >{status} </Text>
          </View>

          <View>
            <BlurView  intensity={40} tint='dark' experimentalBlurMethod='dimezisBlurView'
              style={styles.infoSection}>
              <Text style={styles.descriptionText} numberOfLines={3}>{launchInfo.mission.description}</Text>
              <View style={styles.infoTextSection}>
                <Text style={styles.launcherText} numberOfLines={1}>{launchInfo.rocket.configuration.full_name}</Text>

                <Text style={styles.placeText}numberOfLines={1}>{launchInfo.launch_pad.location.name}</Text>
                <Text style={styles.timeText} >{DAYS[launchTime.getDay()]+" "+MONTHS[launchTime.getMonth()]+" "+launchTime.getDate()+ ", "+launchTime.getFullYear()}</Text>
              </View>

              <View style={styles.timeSection}>
                <TMinus time={launchTime} />

              </View>
            </BlurView>
          </View>
        </View>

    </View>
    </Pressable>
  );

}

export function ForYouEvent(data) {
  const eventData = data.data;
  const date = new Date(eventData.date);
  let name = "";
  if (eventData.program[0] != undefined) {
    name = eventData.program[0].name;
  }

  let status = "Upcoming Event";

  // Set Status
  if (date.getTime() < Date.now()) {
      status = "Recent Event";
  }

  return (
  <View style={styles.page}>
    <Image style={styles.image} source={{uri: eventData.feature_image}} />
    <View style={styles.contentContainer}>
      <View>
        <Text style={styles.eventTitle}>{eventData.name} </Text>
        <Text style={styles.subtitle} numberOfLines={1} >{status}</Text>        
      </View>
      <BlurView  intensity={40} tint='dark' experimentalBlurMethod='dimezisBlurView'
        style={styles.infoSection}>
        <View style={styles.infoTextSection}>
          <Text style={styles.descriptionText} numberOfLines={3}>{eventData.description}</Text>
          <Text style={styles.largeText} numberOfLines={1}>{name}</Text>
          <Text style={styles.text} numberOfLines={1}>{eventData.type.name}</Text>

          <Text style={styles.timeText} >{DAYS[date.getDay()]+" "+MONTHS[date.getMonth()]+" "+date.getDate()+ ", "+date.getFullYear()} </Text>
        </View>
        <View style={styles.timeSection}>
          <TMinus time={eventData.date} />

        </View>
      </BlurView>

    </View>
  </View>
  )
}

export function ForYouEnd(props){
  const news = props.data;
  return (
  <View style={styles.page}>
    <View style={styles.contentContainer}>
      <View>
        <Text style={styles.eventTitle}>You're all caught up! </Text>    
        <Text style={styles.subtitle}>Here are some recent articles:</Text>    
      </View>
      <FlatList
        style={styles.articleSection}
        data={news}
        renderItem={({item}) => <ArticleDescriptive articleData={item} />}
        keyExtractor={(item) => item.id}>

      </FlatList>
    </View>
  </View>
  )

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
    // Sections
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
      height: 250,
      // height: Dimensions.get('window').height-StatusBar.currentHeight-TOP_BAR_HEIGHT-BOTTOM_BAR_HEIGHT-20,
      // height: "80%",


      backgroundColor: 'rgba(52, 52, 52, 0.4)',

      overflow: "hidden",
      
    },
    horizonalTextSection:{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: 'flex-end',
      width: "100%",
    },
    infoTextSection:{
      flex: 2,
      // backgroundColor: 'rgba(52, 52, 52, 0.4)',
      overflow: "hidden",
    },
    timeSection:{
      height: 75,
    },
    // Text
    // TOP SECTION
    title:{
      fontSize: 35,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "600",
      textAlign: "left",

      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 0, height: 1},
      textShadowRadius: 1,
      elevation: 200,
      
      marginHorizontal: 10,
    },
    subtitle:{
      fontSize: 18,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "600",
      textAlign: "left",

      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 0, height: 1},
      textShadowRadius: 1,
      elevation: 200,
      
      marginHorizontal: 12,
    },

    // INFO SECTION
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
    launcherText:{
      fontSize: 33,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
    },
    descriptionText:{
      fontSize: 15,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
      marginRight: 5,
    },
    placeText:{
      fontSize: 20,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
      marginTop: -5
    },
    smallText:{
      fontSize: 15,
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
      marginRight: 5,
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

    },
    tag:{
      fontSize: 17,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
      backgroundColor: COLORS.ACCENT,
      borderRadius: 10,

      marginRight: 5,
      paddingHorizontal: 5,
      paddingBottom: 2,
    },
    
    // EVENT
    eventTitle:{
      fontSize: 30,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "600",
      textAlign: "left",

      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 0, height: 1},
      textShadowRadius: 1,
      elevation: 200,
      
      marginHorizontal: 10,
    },

    // TMinus
    
    timeText:{
      fontSize: 20,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",

      // marginHorizontal: 10,
      // marginBottom: 10,
      // padding: 5,
      
      // backgroundColor: "rgba(30,30,30,0.8)",
      borderRadius: 15,
      // marginLeft: 5,
      marginBottom: 5,

      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: {width: 0, height: 1},
      textShadowRadius: 1,
      elevation: 200,
    },

    // ARTICLES
    articleSection:{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      marginTop: 10,
    },
});