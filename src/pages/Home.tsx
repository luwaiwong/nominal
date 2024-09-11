import { Dimensions, StyleSheet, View } from "react-native";
import Dashboard from "./home/Dashboard";
import ForYou from "./home/ForYou";
import PagerView from "react-native-pager-view";
import { COLORS } from "../styles";
import { useCallback, useEffect, useRef } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSharedValue } from "react-native-reanimated";
import TitleBar from "src/components/Titlebar";

const titleOffset = 75;

export default function Home(props){
    const pagerRef = useRef(null)
    const pageScrollState = useSharedValue(titleOffset);
    
    useFocusEffect(
        useCallback(() => {
            function unsubscribe(){
                console.log("unfocused")
            }

            return () => unsubscribe();
        }, [])
    );
    

    const onPageScroll = (state) => {
      // Handle page scroll state changes (e.g., idle, settling, dragging)
      // Used for title slide animation
      pageScrollState.value = (state["nativeEvent"]["offset"]+state["nativeEvent"]["position"]) * -150 + titleOffset;
    }

    return (
    <> 
        <TitleBar scrollState={pageScrollState} titles={["For You", "Dashboard"]}/>
        <PagerView
            style={styles.pagerView}
            orientation="horizontal" 
            ref={pagerRef}
            onPageScroll={onPageScroll}
        >
            <ForYou />
            <Dashboard />
        </PagerView>
    </>
   )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    width: "100%",
    height: "100%",
  },
  pagerView: {
    display: "flex",
    flex: 1,
    zIndex: 100,
  },
  reloadingDataIndicator:{
    position: "absolute",
    bottom: COLORS.BOTTOM_BAR_HEIGHT+50,
    // left: Dimensions.get("window").width/2-100,
    width: "100%",
    height: 5,
    // backgroundColor: colors.FOREGROUND,
    zIndex: 100000,
  },
  reloadingDataText:{
    position: "absolute",
    // bottom: colors.BOTTOM_BAR_HEIGHT+ 20,

    backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
    width: 200,
    // height: 50,
    fontSize: 20,

    borderRadius: 15,
    paddingVertical: 5,

    marginLeft: Dimensions.get("window").width/2-100,
    // width: "100%",
    textAlign: "center",
    color: COLORS.FOREGROUND,
    fontFamily: COLORS.FONT,
    zIndex: 10000,
  }

});
