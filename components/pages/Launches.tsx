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


  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await userData.getUpcomingLaunches().then((data) => {
      setUpcomingLaunches(data);
    })
    await userData.getPreviousLaunches().then((data) => {
      setPreviousLaunches(data);
    });
    
  }

  function updatePinned(){
  }



  return (
    <View style={{flex: 1}}>
      <Regular userData={userData} upcomingLaunches={upcomingLaunches} previousLaunches={previousLaunches}/>
    </View>
  );
}
