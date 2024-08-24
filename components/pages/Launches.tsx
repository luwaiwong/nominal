import React, {useContext, useEffect, useRef, useState} from 'react';
import { StyleSheet, View, Text, Animated, ScrollView, StatusBar, Dimensions, FlatList, Pressable, TextInput } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MaterialIcons } from 'react-native-vector-icons';

import LaunchInfo from '../styled/Launch';
import Loading from '../styled/Loading';
import {BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT} from '../styles';
import { UserContext } from '../data/UserContext';
import { BottomSheetAndroid } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import LaunchHighlight from '../styled/HighlightLaunch';
import PagerView from 'react-native-pager-view';

export default function Launches(props){
    const userContext = useContext(UserContext);

    // Animation Hooks
    const [launches, setLaunches] = useState({upcoming: [], previous: []})
    const [search, setSearch] = useState("")

    function checkLaunchData(){
      let hasLaunches = userContext != null && userContext.launches != null && userContext.launches.upcoming != undefined && userContext.launches.upcoming.length > 0
      if (hasLaunches)
      {
        let newlaunches = {upcoming: userContext.launches.upcoming, previous: userContext.launches.previous}
        // Check same
        if (JSON.stringify(launches) != JSON.stringify(newlaunches)){
          setLaunches(newlaunches)
        }
      }
    }

    function sortData(data = launches.upcoming){
      if (data.length != 0 && data != null && data != undefined){
        data = data.filter(item => sortItem(item));
      }
      return data
    }
    function sortItem(item){
      if (item.name.toLowerCase().includes(search.toLowerCase()))
      {
        return true
      }
      if (item.rocket.configuration.full_name.toLowerCase().includes(search.toLowerCase()))
      {
        return true
      }
      if (item.launch_provider.name.toLowerCase().includes(search.toLowerCase()))
      {
        return true
      }
      
      return false

    }

    // Check if data is updated every 5 seconds, if so update stuff
    useEffect(()=>{
      const intervalId = setInterval(() => {
        checkLaunchData()
      }, 2000); // 1000 milliseconds = 1 second

      // Clear interval on re-render to avoid memory leaks
      return () => clearInterval(intervalId);
    }, [])

    // Check if data is loaded
    if (userContext.launches === undefined){
        return <Loading/>
    }


    // INFO
    const nav = userContext.nav; 

    

    return (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
                <Text style={styles.title}>Missions</Text>
          </View>
          {/* Search Area */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.textInput} 
              editable={true}
              multiline={false}
              onChangeText={setSearch}
              placeholder='Search'
              placeholderTextColor={COLORS.SUBFOREGROUND}
              cursorColor={COLORS.ACCENT}
              // disableFullscreenUI={true}
            />
          </View>
          {/* Content Section */}
          <View style={[styles.contentContainer]}>
            {/* Upcoming Section */}
            <PagerView 
              style={styles.contentSection}
              orientation="horizontal" 
            >
              <FlatList
                  data={sortData()}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <LaunchInfo data={item}  nav={nav}> </LaunchInfo>}
                  ListFooterComponent={<View style={styles.bottomPadding}></View>}
                  removeClippedSubviews={true}
                  initialNumToRender={1}
                  // maxToRenderPerBatch={10}
                  windowSize={3}
                  >
                  
              </FlatList>
              <FlatList
                  data={sortData(launches.previous)}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <LaunchInfo data={item}  nav={nav}> </LaunchInfo>}
                  ListFooterComponent={<View style={styles.bottomPadding}></View>}
                  removeClippedSubviews={true}
                  initialNumToRender={1}
                  // maxToRenderPerBatch={10}
                  windowSize={3}
                  >
                  
              </FlatList>
            </PagerView>
          </View>
        </View>
      );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
      height: Dimensions.get('window').height,
    },
    searchBar:{
      display: "flex",
      justifyContent: "center",
      alignContent:"center",

      height: 40,
      // width:" 95%",
      backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
      marginHorizontal: 10,
      borderRadius: 10,
      marginBottom: 10,


      paddingHorizontal: 10,
    },
    textInput:{
      fontSize: 18,
      fontFamily: FONT,
      color: COLORS.FOREGROUND,
    },

    tagContainer:{
      display:"flex",
      flexDirection: "row",
      marginBottom: 10,

    },
    tag:{
      fontFamily: FONT,
      color:COLORS.FOREGROUND,
      backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,

      padding: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginLeft: 10,
    },

    // Content Section
    contentContainer:{
      display: 'flex',
      flexDirection: 'row',
      // position: 'absolute',
      marginLeft: "0%",
      width: "100%",
      // height: Dimensions.get('window').height-TOP_BAR_HEIGHT-StatusBar.currentHeight-60,
      // paddingBottom: BOTTOM_BAR_HEIGHT,
      // backgroundColor: 'white',
      
      overflow: "hidden",
      flex: 1
    },
    contentSection: {
      display: 'flex',

      // marginBottom: 50,
      // overflow: 'hidden',
      flex: 1
    },
    titleContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginTop: StatusBar.currentHeight,
        height: TOP_BAR_HEIGHT,
    },
    title:{
        fontSize: 24,
        color: COLORS.FOREGROUND,
        width: "100%",
        textAlign: 'center',
        alignContent: 'center',

        fontFamily: FONT,

        marginBottom: 2,
    },
    bottomPadding:{
      height: BOTTOM_BAR_HEIGHT-10,
    }
});