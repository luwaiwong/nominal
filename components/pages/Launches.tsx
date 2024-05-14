import { StyleSheet, View, Text, ScrollView, Animated, Pressable } from "react-native";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import PagerView from 'react-native-pager-view';
import { MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

import Regular from "./Launches/Regular";
import Immersive from "./Launches/Immersive";

import * as colors from "../styles";
import Tags from "./Tags";

export default function Launches(props) {
  let userData = props.data.userData;
  let [upcomingLaunches, setUpcomingLaunches] = useState<any>([]);
  let [previousLaunches, setPreviousLaunches] = useState<any>([]);

  // App State
  let [tagsShown, setTagsShown] = useState<any>(false);
  let [immersiveShown, setImmersiveShown] = useState<any>(false);


  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await userData.getAllUpcomingLaunches().then((data) => {
      setUpcomingLaunches(data);
    })
    await userData.getPreviousLaunches().then((data) => {
      setPreviousLaunches(data);
    });
    
  }
  async function toggleTags(){
    console.log("Toggling Tags");
    setTagsShown(!tagsShown);

    if (tagsShown){
      fetchData();
    }
    // #TODO: Reload upcoming launches data when switching back to launches page
  }

  function updatePinned(){
  }

  

  function CurrentScreen(){
    if (immersiveShown){
      return <Immersive userData={userData} upcomingLaunches={upcomingLaunches}/>
    }
    else{
      return <Regular userData={userData} upcomingLaunches={upcomingLaunches} previousLaunches={previousLaunches}/>;
    }
  }

  return (
    <View style={{flex: 1}}>
      <Tags shown={tagsShown} userData={userData}/>
      <CurrentScreen/>
    </View>
  );
}
