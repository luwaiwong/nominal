import { StyleSheet, View, Text, Image, StatusBar, Dimensions, FlatList, Pressable, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback, Linking, ScrollView } from "react-native";
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import {BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT} from "../styles";
import { BlurView } from "expo-blur";
import TMinus from "./TMinus";
import Article from "./Article";
import ArticleDescriptive from "./ArticleDescriptive";
import { UserContext } from "../data/UserContext";
// import { BlurView } from "@react-native-community/blur";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const ForYouLaunch = React.memo((data:any) => {
  const userContext = useContext(UserContext);
  let launchInfo = data.data;  
  let [launchTime, setLaunchTime] = useState<any>(new Date(launchInfo.net));

  let [descriptionOpen, setDescriptionOpen] = useState(false);

  let status = "Upcoming Launch";
  let statusColor = COLORS.FOREGROUND;
  // Set Status for Time
  if (launchTime.getTime() < Date.now()) {
      status = "Recently Launched";
  }
  // console.log(Object.keys(launchInfo))
  // return <></>
  // Check Status for Launch
  if (launchInfo.status.id === 4) {
      status = "Failed Launch";
      statusColor = COLORS.RED;
  }   else if (launchInfo.status.id === 7) {
      status = "Partial Failure";
      statusColor = COLORS.YELLOW;
  }  else if (launchInfo.status.id === 3) {
      status = "Successful Launch";
      statusColor = COLORS.GREEN;
  }

  return (
    <Pressable onPress={()=>userContext.nav.navigate("Launch", {data: launchInfo})}>
      <View style={styles.page}>
        <Image style={styles.image} source={{uri: launchInfo.image}} />
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.title} numberOfLines={1} >{launchInfo.mission.name} </Text>
            <Text style={[styles.subtitle,{color: statusColor}]} numberOfLines={1} >{status} </Text>
          </View>

          <View>
            <BlurView  intensity={40} tint='dark' experimentalBlurMethod='dimezisBlurView'
              style={styles.infoSection}>
                <Pressable onPress={()=>setDescriptionOpen(!descriptionOpen)}>
                  <Text style={styles.descriptionText} numberOfLines={descriptionOpen?10:5}>{launchInfo.mission.description}</Text>
                </Pressable>
              <View style={styles.infoTextSection}>
                <Text style={styles.launcherText} numberOfLines={1}>{launchInfo.rocket.configuration.full_name}</Text>

                <Text style={styles.placeText}numberOfLines={1}>{launchInfo.launch_pad.location.name}</Text>
                {/* <Text style={styles.timeText} >{DAYS[launchTime.getDay()]+" "+MONTHS[launchTime.getMonth()]+" "+launchTime.getDate()+ ", "+launchTime.getFullYear()}</Text> */}
                <Text style={styles.timeText} >{launchTime.toLocaleString([],{
                      hour: '2-digit',
                      minute: '2-digit',
                      month: 'long',
                      day: 'numeric',weekday: 'long'})} </Text>
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

})

export function ForYouEvent(data) {
  const userContext = useContext(UserContext);
  const eventData = data.data;
  const date = new Date(eventData.date);
  let name = "";
  if (eventData.program[0] != undefined) {
    name = eventData.program[0].name;
  }

  let description = eventData.description;
  // description = description.replace(/\. (?=[A-Z])/g, );

  let status = "Upcoming Event";

  // Set Status
  if (date.getTime() < Date.now()) {
      status = "Recent Event";
  }

  let [descriptionOpen, setDescriptionOpen] = useState(false);

  return (
  <Pressable onPress={()=>userContext.nav.navigate("Event", {data: eventData})}>
      
  <View style={styles.page}>
    <Image style={styles.image} source={{uri: eventData.feature_image}} />
    <View style={styles.contentContainer}>
      <BlurView intensity={40} tint='dark' experimentalBlurMethod='dimezisBlurView' style={styles.eventSection}>
        <Text style={styles.eventTitle}>{eventData.name} </Text>
        <Text style={styles.subtitle} numberOfLines={1} >{status}</Text>        
      </BlurView>
      <BlurView  intensity={40} tint='dark' experimentalBlurMethod='dimezisBlurView'
        style={styles.infoSection}>
        <View style={styles.infoTextSection}>
          <Pressable onPress={()=>setDescriptionOpen(!descriptionOpen)}>
            <Text style={styles.descriptionText} numberOfLines={descriptionOpen?15:5}>{description}</Text>

          </Pressable>
          {eventData.type.name != null &&
          <Text style={styles.largeText} numberOfLines={1}>{eventData.type.name}</Text>}
          {name != "" && <Text style={styles.text} numberOfLines={1}>{name}</Text>}
          

          <Text style={styles.timeText} >{DAYS[date.getDay()]+" "+MONTHS[date.getMonth()]+" "+date.getDate()+ ", "+date.getFullYear()} </Text>
        </View>
        <View style={styles.timeSection}>
          <TMinus time={eventData.date} />

        </View>
      </BlurView>

    </View>
  </View>
    </Pressable>
  )
}

export function ForYouNews(props){
  const news = props.data;
  return (
  <View style={styles.page}>
    <View style={styles.articleSection}>
        <View>
          <Text style={styles.articleTitle}>You're all caught up! </Text>    
          <Text style={styles.articleSubtitle}>Here are some recent articles:</Text>    
        </View>

        {/* <ScrollView> */}
              {news.map((article) => {
                return <ArticleDescriptive articleData={article} key={article.id} />
              })
            }
        {/* </ScrollView> */}
          {/* <Text style={styles.bottomText}>Swipe right to view your dashboard, or </Text>   */}
          <Text style={styles.bottomText}>Keep scrolling for recent launches & events...</Text>    
          {/* <View style={styles.bottomPadding}></View> */}

      </View>
  </View>
  )

}
export function ForYouEnd(props){
  const news = props.data;
  return (
  <View style={styles.page}>
    <View style={styles.articleSection}>
        <View>
          <Text style={styles.articleTitle}>That's all for now! </Text>    
          <Text style={styles.articleSubtitle}>Here are some more articles:</Text>  
          {/* <Text style={styles.bottomText}>Swipe right to view your dashboard</Text>      */}
        </View> 

        {news.map((article) => {
          return <ArticleDescriptive articleData={article} key={article.id} />
        })}
        <Text style={styles.bottomText}>{"Swipe right to view your dashboard >"} </Text>   

      </View>
  </View>
  )

}
export function ForYouImageOfDay(props) {
  let data = props.data;  
  let [descriptionOpen, setDescriptionOpen] = useState(false);
  let description = data.explanation;
  let date = new Date(data.date);
  return (
    <Pressable onPress={()=>{Linking.openURL(data.hdurl)}}>
      
    <View style={styles.page}>
        <Image style={styles.image} source={{uri: data.url}} />
        <View style={styles.contentContainer}>

          <BlurView intensity={40} tint='dark' experimentalBlurMethod='dimezisBlurView' style={styles.eventSection}>
                <Text style={styles.title} numberOfLines={3} >{data.title}</Text>
                <Text style={[styles.subtitle]} numberOfLines={1} >NASA Astronomy Picture of the Day</Text>     
          </BlurView>

          <TouchableOpacity>
            <BlurView  intensity={40} tint='dark' experimentalBlurMethod='dimezisBlurView'
              style={styles.infoSection}>
                <Pressable onPress={()=>setDescriptionOpen(!descriptionOpen)}>
                  <Text style={styles.descriptionText} numberOfLines={descriptionOpen?100:5}>{description}</Text>
                </Pressable>
              <View style={styles.infoTextSection}>
                {/* <Text style={styles.launcherText} numberOfLines={1}>{data.copyright}</Text> */}

                {data.copyright != undefined && <Text style={styles.placeText}>Copyright: {data.copyright.trim()}</Text>}
                <Text style={styles.timeText} >{DAYS[date.getUTCDay()]+" "+ MONTHS[date.getUTCMonth()] + " " +date.getUTCDate()+", " +date.getUTCFullYear()}</Text>
              </View>
            </BlurView>
          </TouchableOpacity>
        </View>

    </View>
    </Pressable>
  );

}



const styles = StyleSheet.create({
    page:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        // backgroundColor: "white",
        // width: "100%",
        // height: "100%",
        height: Dimensions.get('window').height+StatusBar.currentHeight,
        
        
    },
    image:{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        // height: Dimensions.get('window').height+StatusBar.currentHeight,
    },
    // Sections
    contentContainer:{
      // width:"100%",
      height: "100%",
      // paddingBottom: BOTTOM_BAR_HEIGHT,

      // height: Dimensions.get('window').height+StatusBar.currentHeight,
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
      paddingBottom: 0,

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
      marginBottom: 5,
    },
    timeSection:{
      height: 75,
    },
    // Text
    // TOP SECTION
    title:{
      fontSize: 26,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "600",
      textAlign: "left",

      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1.5, height: 2},
      textShadowRadius: 5,
      elevation: 200,
      
      marginHorizontal: 10,
    },
    subtitle:{
      fontSize: 19,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "600",
      textAlign: "left",

      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1.5, height: 1.5},
      textShadowRadius: 5,
      elevation: 200,
      
      marginHorizontal: 10,
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
      textShadowRadius: 5,
      elevation: 200,
    },
    launcherText:{
      fontSize: 33,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
      marginBottom: -5
    },
    descriptionText:{
      fontSize: 16,
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
      // marginTop: -5
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
    
    tagsSection:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        width: "100%",
        // marginLeft: 12,
        marginTop: 4,
        // marginBottom: 20,
    },
    tag:{
      fontSize: 15,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
      backgroundColor: COLORS.ACCENT,
      borderRadius: 10,

      marginRight: 5,
      paddingHorizontal: 5,
      paddingBottom: 2,
      marginTop: 5,
    },
    // EVENT
    eventSection:{
      backgroundColor: 'rgba('+COLORS.BACKGROUND_RGB+'0.1)',
      borderRadius: 10,
      marginHorizontal: 10,
      paddingBottom: 5,
      overflow: "hidden",

    },
    eventTitle:{
      fontSize: 30,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "600",
      textAlign: "left",

      textShadowColor: 'rgba(0, 0, 0, 0.6)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 1,
      elevation: 200,
      
      marginHorizontal: 10,
      marginRight: 10,
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
    articleContainer:{
      display: "flex",
      flexDirection: "column",
      // backgroundColor: 'white',
      
      // marginTop: 25,
    },
    articleSection:{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginTop: StatusBar.currentHeight+TOP_BAR_HEIGHT-10,

      // backgroundColor: 'white',
      flex: 1,

      
      width: "100%",
      height: Dimensions.get('window').height-StatusBar.currentHeight-BOTTOM_BAR_HEIGHT-10,
    },
    articleTitle:{
      fontSize: 30,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "600",
      textAlign: "left",

      textShadowColor: 'rgba(0, 0, 0, 0.6)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 1,
      elevation: 200,
      
      marginHorizontal: 15,
      marginRight: 10,
      marginTop: 10
    },
    articleSubtitle:{
      fontSize: 18,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "600",
      textAlign: "left",

      textShadowColor: 'rgba(0, 0, 0, 0.6)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 1,
      elevation: 200,
      
      marginHorizontal: 15,
      marginRight: 10,
      marginBottom  : 10,
    },
    bottomText:{
      fontSize: 20,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "600",
      textAlign: "left",
      
      marginHorizontal: 15,
      marginRight: 10,
      marginBottom  : 25,

    },
    bottomPadding:{
      height: BOTTOM_BAR_HEIGHT+10,
    }
});