import React, {useContext, useEffect, useRef, useState} from 'react';
import { StyleSheet, View, Text, Animated, ScrollView, StatusBar, Dimensions, FlatList, Pressable, TextInput } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MaterialIcons } from 'react-native-vector-icons';
import PagerView from 'react-native-pager-view';
import { useSharedValue } from 'react-native-reanimated';

import { useUserStore } from 'src/utils/UserStore';
import { HideMenuBarOnScroll, HideMenuBarOnScrollFlatList } from 'src/utils/Helpers';
import {BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT} from '../styles';

import LaunchInfo from 'src/components/Launch';
import Loading from 'src/components/Loading';

export default function Launches(props){

    // Info Hooks
    const nav = useUserStore(state=>state.nav)
    const setMenuBarShown = useUserStore(state=>state.nav)
    const upcomingLaunches = useUserStore(state=>state.upcomingLaunches)
    const previousLaunches = useUserStore(state=>state.previousLaunches)
    const [search, setSearch] = useState("")
    const [tags, setTags] = useState("")

    // Anim Hookd
    let pageScrollState = useSharedValue(0)
    let pagerRef = useRef(null)

    //#region Getting Data
    function sortData(data){
      let result = []
      if (data.length != 0 && data != null && data != undefined){
        result = data.filter(item => sortItem(item));
      }
      return result
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

    //#endregion

    //#region Animations
    function setPage(page){
      if (pagerRef.current != null){
        pagerRef.current.setPage(page);
      }
    }

    // Called when the page is scrolling
    // Use to handle animations while page is scrolling (e.g. bottom sliding animation)
    const onPageScrollStateChanged = (state) => {
      // Handle page scroll state changes (e.g., idle, settling, dragging)
      // Example: Log the state change
      // console.log('Page scroll state:', state);
      // Can be 
    };

    const onPageScroll = (state) => {
      // Handle page scroll state changes (e.g., idle, settling, dragging)
      // Example: Log the state change
      // console.log('Page scroll state:', state["nativeEvent"]);
      pageScrollState.value = (state["nativeEvent"]["offset"]+state["nativeEvent"]["position"]) * -150;
      // Can be 
      // setCurrentPage(page);
      // if (pagerRef.current != null){
      //   pagerRef.current.setPage(page);
      // }
    }
    // Called when the page is changed
    const onPageSelected = (event) => {
      // Handle page selection
      const { position } = event.nativeEvent;

      // console.log('Page changed to:', position);
      // currentPage.current = position;

    };

    //#endregion

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
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, {left:Dimensions.get("window").width/8}]}>
              Upcoming
              </Text>
            <Text style={[styles.timeText, {right:Dimensions.get("window").width/8}]}>
              Previous
            </Text>
            <View style={styles.timeIndicator}></View>
          </View>
          {/* Content Section */}
          <View style={[styles.contentContainer]}>
            {/* Upcoming Section */}
            <PagerView 
              style={styles.contentSection}
              orientation="horizontal" 
              ref={pagerRef}
              onPageScrollStateChanged={onPageScrollStateChanged}
              onPageScroll={onPageScroll}
              onPageSelected={onPageSelected}
            >
              <FlatList
                data={sortData(upcomingLaunches)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <LaunchInfo data={item}  nav={nav}> </LaunchInfo>}
                removeClippedSubviews={true}
                initialNumToRender={4}
                windowSize={3}
                onScroll={(event)=>HideMenuBarOnScrollFlatList(event,setMenuBarShown)}
                ListFooterComponent={<View style={styles.bottomPadding}></View>}
              />
              <FlatList
                data={sortData(previousLaunches)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <LaunchInfo data={item}  nav={nav}> </LaunchInfo>}
                removeClippedSubviews={true}
                initialNumToRender={4}
                windowSize={3}
                onScroll={(event)=>HideMenuBarOnScrollFlatList(event,setMenuBarShown)}
                ListFooterComponent={<View style={styles.bottomPadding}></View>}
              />
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
    },
    timeContainer:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: "space-between",


      width: "100%",
      height: 30,

      // backgroundColor: COLORS.RED
      marginBottom: 10,
      


    },
    timeText:{
      fontFamily: FONT,
      color: COLORS.FOREGROUND,

      textAlign: 'center',
      position: 'absolute',
      
      // backgroundColor: COLORS.GREEN,
      width: "25%",
      top: 5,
      

    },
    timeIndicator:{
      position: "absolute",
      width: Dimensions.get("window").width/2-10,
      height: 30,

      left: 10,
      borderRadius: 10,

      backgroundColor: COLORS.ACCENT,
      zIndex: -1
    }
});