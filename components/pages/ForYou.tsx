import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { useEffect, useState } from "react";
import PagerView from "react-native-pager-view";

import { COLORS, FONT } from "../styles";
import Loading from "../styled/Loading";

import {ForYouLaunch, ForYouEvent, ForYouEnd} from "../styled/ForYouItem";

export default function ForYou(props) {
  let userData = props.data.userData;
  let launchData = props.data.launchData;
  let foryou = launchData.foryou;
  let news = launchData.news;

  return(
      <PagerView style={styles.immersiveSection} initialPage={0} orientation="vertical" >
        {foryou.map((item: any) => {
            if (item.type == "launch"){
              return (
                <ForYouLaunch key={item.id} data={item} user={userData} nav={props.data.nav}/>
              );
            } else {
              return (<ForYouEvent key={item.id} data={item} user={userData}  nav={props.data.nav}/>);
            }
        })}
        <ForYouEnd data={news.slice(0,3)}/>
      </PagerView>
    );
}


const styles = StyleSheet.create({
  immersiveSection:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    

    // marginTop: 60,

    width: '100%',
    height: '100%',

    backgroundColor: COLORS.FOREGROUND,

    // zIndex: -1000
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
