
import { ScrollView, StatusBar, StyleSheet, Text, View, Animated, Pressable, Dimensions, RefreshControl} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT } from "../styles";

import Article from "src/components/Article";
import Event from "src/components/Event";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "src/utils/UserContext";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import ArticleDescriptive from "src/components/ArticleDescriptive";
import Loading from "src/components/Loading";
import { useUserStore } from "src/utils/UserStore";
import Articles from "src/components/Articles";
import LiveChannels from "src/components/LiveChannels";
const NEWS_API_URL = "https://api.spaceflightnewsapi.net/v4/";

export default function News(props){
    let nav = useUserStore(state=>state.nav)

    //Endless News
    return (
    <View style={styles.container}>
        <Text style={styles.title}>News</Text>
        <LiveChannels/>
    </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        color: 'white',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: StatusBar.currentHeight,
        height: Dimensions.get('window').height - StatusBar.currentHeight - TOP_BAR_HEIGHT ,
        width: '100%',

        zIndex: 100,
    },
    // Title
    title:{
        fontFamily: FONT,
        fontSize: 24,
        color: COLORS.FOREGROUND,
        
        width: "100%",
        height: TOP_BAR_HEIGHT-10,
        marginTop: 10,
        textAlign: "center",
        

    },
    // SECTION STUFF
    sectionContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',


        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,

        paddingTop: 2,
        marginTop: 10,
        // marginBottom: 10,
        marginHorizontal: 10,
        
        
    },
    // SECTION HEADERS
    sectionHeader:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 3,
        marginBottom: 5,
    },
    sectionTitle:{
        fontSize: 24,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        // marginBottom: 10,
        marginLeft: 10,
    },
    seeMoreText:{
        fontSize: 18,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
        marginRight: 5,
        alignContent: 'flex-end',
        marginBottom: 1,
    },
    sectionIcon:{
        fontSize: 25,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
        marginRight: 10,
    },
    seeMoreSection:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        
    },
    bottomPadding:{
        height: BOTTOM_BAR_HEIGHT-10,
    },
    
})