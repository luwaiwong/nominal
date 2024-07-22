
import { ScrollView, StatusBar, StyleSheet, Text, View, Animated, Pressable, Dimensions, RefreshControl} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT } from "../styles";

import Article from "../styled/Article";
import Event from "../styled/Event";
import { useState } from "react";
import { UserContext } from "../data/UserContext";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function News(props){
    let userContext = useState(UserContext);
    const launchData = props.data.launchData;    
    const news = props.data.launchData.news.slice(0,6);

    const nav = props.data.nav;
    const eventsHighlights = props.data.launchData.eventsHighlights;
    const upcomingEvents = props.data.launchData.events.upcoming;
    const previousEvents = props.data.launchData.events.previous;

    const [refreshing, setRefreshing] = useState(false)
    async function refreshData(){
        setRefreshing(true)
        await props.data.reloadData().then((data)=> {
        console.log("Finishing Refresh")
        setRefreshing(false)
        })
    }

    return (<>
        <View style={styles.container}>
            <ScrollView 
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={()=>{refreshData()}
                  } colors={[COLORS.FOREGROUND]} progressBackgroundColor={COLORS.BACKGROUND_HIGHLIGHT}/>
                }>
                
                <View style={styles.sectionContainer}>
                    <TouchableOpacity onPress={() => {nav.navigate('All News', {data:launchData.news})}}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Articles</Text>
                            <View style={styles.seeMoreSection}>
                                <Text style={styles.seeMoreText}>See All</Text>
                                <MaterialIcons name="arrow-forward-ios" style={styles.sectionIcon}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{height:10}}></View>
                    {news != undefined && news.map((item, index) => {return (<Article articleData={item} key={index}/>);})}
                    {/* <Article articleData={news[4]}></Article> */}
                </View>
                {/* <Text style={styles.eventsTitle}>Events</Text>  */}
                    
                <View style={styles.bottomBuffer}></View>
            </ScrollView>
        </View>
    </>)
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        color: 'white',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: StatusBar.currentHeight + TOP_BAR_HEIGHT,
        height: Dimensions.get('window').height - StatusBar.currentHeight - TOP_BAR_HEIGHT ,
        width: '100%',

        zIndex: 100,
    },
    // SECTION STUFF
    sectionContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',


        // backgroundColor: COLORS.BACKGROUND,
        borderRadius: 15,
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        
    },
    eventsTitle:{
        fontSize: 25,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'center',
        // marginBottom: 10,
        marginLeft: 12,
        marginTop: 10,
    },
    eventsContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',


        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 15,
        marginTop: 10,
        marginHorizontal    : 10,
        marginBottom: 10,
        
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
        marginRight: 10,
        alignContent: 'flex-end',
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
    bottomBuffer:{
        height: BOTTOM_BAR_HEIGHT,
    }
    
})