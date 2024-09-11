import { useFonts } from "expo-font";
import { SpaceGrotesk_500Medium } from "@expo-google-fonts/space-grotesk";
import { IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans'

import { AppState, Dimensions, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, Animated, Alert } from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import PagerView from "react-native-pager-view";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Components
import Loading from "src/components/Loading";



import * as colors from "src/styles";
import { useSharedValue } from "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "src/pages/Home";
import { useUserStore } from "./utils/UserStore";
import * as Query from "./utils/QueryHandler";


const titleOffset = 300

export default function App(props) {
  let appState = useRef(AppState.currentState);
  let [currentPage, setCurrentPage] = useState(0);

  const refreshOpacity = useRef(new Animated.Value(0)).current

  // API CALLS
  const setNav = useUserStore(state=>state.setNav)
  Query.useUpcoming10LaunchesQuery()
  Query.usePrevious10LaunchesQuery()
  

  const startRefreshAnimation = () => {Animated.loop(
      Animated.sequence([
        Animated.timing(
          refreshOpacity,
          {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
            delay: 0,
          }
        ),
        Animated.timing(
          refreshOpacity,
          {
            toValue: 0,
            duration: 750,
            useNativeDriver: true,
            delay: 0,
          }
        )
      ])
    ).start()
  }

  useEffect(()=>{
    setNav(props.navigation)

  }, [])

  // Subscribe and check app state
  useEffect(()=>{
    const subscription = AppState.addEventListener("change", nextAppState => {
      console.log("App State", appState.current, nextAppState)
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("App focused")
        try {
          reloadData(true)
        } catch(e){
          Alert.alert("Error when reloading data", "Error "+ e);
        }
      }
      else {
      }
        appState.current = nextAppState;
    })

    return () => {
      subscription.remove();
    }
  }, [])


  // Reload function called with pull down reload gesture
  async function reloadData(isPageLoad=false){
  }

  // Checks if font is loaded, if the font is not loaded yet, just show a loading screen
  const [fontsLoaded] = useFonts({
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold
  });
  if (!fontsLoaded) {
    return <Loading />;
  }

  // Page Change Handling
  // Use to change current page when button pressed
  function setPage(page){
    setCurrentPage(page);
  }

  const Tab = createBottomTabNavigator();

  let data = {
    reloadData: reloadData,
    nav: props.navigation,
    setPage: setPage,
  };
  // Main App View
  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Tab.Navigator 
          // tabBar={props => <MenuBar {...props}/>}
          tabBar={props=> <></>}
          screenOptions={{
            headerShown:false, 
          }}
        >
          <Tab.Screen name="Home" children={()=><Home/>} />
          {/* <Tab.Screen name="Launches" children={()=><Launches data={data}/>}/>
          <Tab.Screen name="News" children={()=><News data={data}/>}/>
          <Tab.Screen name="Settings" children={()=><Settings/>}/> */}
        </Tab.Navigator>
        <View pointerEvents='none' style={styles.reloadingDataIndicator}>
          <Animated.Text style={[styles.reloadingDataText, {opacity: refreshOpacity}]} >Refreshing Data...</Animated.Text>
        </View>
        
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BACKGROUND,
    width: "100%",
    height: "100%",
  },
  pagerView: {
    flex: 1,
    zIndex: 100,
  },
  reloadingDataIndicator:{
    position: "absolute",
    bottom: colors.BOTTOM_BAR_HEIGHT+50,
    // left: Dimensions.get("window").width/2-100,
    width: "100%",
    height: 5,
    // backgroundColor: colors.FOREGROUND,
    zIndex: 100000,
  },
  reloadingDataText:{
    position: "absolute",
    // bottom: colors.BOTTOM_BAR_HEIGHT+ 20,

    backgroundColor: colors.BACKGROUND_HIGHLIGHT,
    width: 200,
    // height: 50,
    fontSize: 20,

    borderRadius: 15,
    paddingVertical: 5,

    marginLeft: Dimensions.get("window").width/2-100,
    // width: "100%",
    textAlign: "center",
    color: colors.FOREGROUND,
    fontFamily: colors.FONT,
    zIndex: 10000,
  }

});
