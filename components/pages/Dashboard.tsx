import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import { useEffect, useState } from "react";

import * as colors from "../styles";
import Loading from "../styled/Loading";

import Regular from "./Dashboard/Regular";
import Immersive from "./Dashboard/Immersive";

export default function Dashboard(props) {
  let userData = props.data.userData;
  let immersiveShown = props.data.immersive
  let upcomingLaunches = props.data.upcoming
  let previousLaunches = props.data.previous
  let pinnedLaunches = props.data.pinned
  let setPinned = props.data.setPinned


  function CurrentScreen(){
    if (immersiveShown){
      return <Immersive upcomingLaunches={upcomingLaunches} userData={userData}/>
    }
    else{
      return (<Regular userData={userData} pinnedLaunches={pinnedLaunches} setPinned={setPinned} upcomingLaunches={upcomingLaunches} previousLaunches={previousLaunches}/>)
    }
  }

  return (
    <View>
      <CurrentScreen/>
    </View>
  );
}
