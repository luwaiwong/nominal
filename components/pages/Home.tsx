import { Dimensions, StyleSheet, View } from "react-native";
import Dashboard from "./Home/Dashboard";
import ForYou from "./Home/ForYou";
import PagerView from "react-native-pager-view";
import { COLORS } from "../styles";
import { useCallback, useEffect, useRef } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

export default function Home(data){
    const pagerRef = useRef(null)

    // const isFocused = useIsFocused();
    // console.log(isFocused)
    
    useFocusEffect(
        useCallback(() => {
            console.log(console.log(pagerRef.current.page))
            
            function unsubscribe(){
                console.log("unfocused")
            }

            return () => unsubscribe();
        }, [])
    );
    return (
    <> 
            {/* <Dashboard data={data}/> */}
        <PagerView
            style={styles.pagerView}
            orientation="horizontal" 
            ref={pagerRef}
        >
            <ForYou data={data.data}/>
            <Dashboard data={data.data}/>

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
