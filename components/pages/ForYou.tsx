import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { useEffect, useState } from "react";
import PagerView from "react-native-pager-view";

import { COLORS, FONT } from "../styles";
import Loading from "../styled/Loading";

import ImmersivePage from "../styled/ImmersivePage";

export default function ForYou(props) {
  let userData = props.data.userData;
  let immersiveShown = props.data.immersive
  let upcomingLaunches = props.data.upcoming
  let previousLaunches = props.data.previous
  let pinnedLaunches = props.data.pinned
  let setPinned = props.data.setPinned

  return(
      <PagerView style={styles.immersiveSection} initialPage={0} orientation="vertical" >
        {upcomingLaunches.map((launch: any) => {
            return (
              <ImmersivePage key={launch.id} data={launch} user={userData}/>
            );
        })}
      </PagerView>
    );
}


const styles = StyleSheet.create({
  immersiveSection:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    

    marginTop: -60,

    width: '100%',
    height: '100%',

    backgroundColor: COLORS.FOREGROUND,
  
  },
  immersivePage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    
    width: '100%',
    height: '100%',


    paddingTop: 60,
    backgroundColor: COLORS.FOREGROUND,
  },
  immersivePageTitle:{
    fontSize: 32,
    color: COLORS.BACKGROUND,
    fontFamily: COLORS.ACCENT,
    margin: 16,
  },
});
