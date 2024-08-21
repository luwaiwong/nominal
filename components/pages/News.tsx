
import { ScrollView, StatusBar, StyleSheet, Text, View, Animated, Pressable, Dimensions, RefreshControl} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT } from "../styles";

import Article from "../styled/Article";
import Event from "../styled/Event";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../data/UserContext";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import ArticleDescriptive from "../styled/ArticleDescriptive";
import Loading from "../styled/Loading";
import { StarshipDashboard } from "./subpages/Locations/StarshipPage";
import { ISSDashboard } from "./subpages/Locations/ISSPage";
const NEWS_API_URL = "https://api.spaceflightnewsapi.net/v4/";

export default function News(props){
    let userContext = useContext(UserContext);
    let callingData = useRef(false);
    let currentOffset = useRef(10);
    const [refreshing, setRefreshing] = useState(false)

    // Check data loaded
    if (userContext == null || userContext.news == null){
        return <Loading/>
    }

    let upcomingEvents = userContext.events.upcoming.filter((event)=>{return new Date(event.date).getTime() > new Date().getTime()});
    let previousEvents = userContext.events.previous;
    let news = userContext.news.slice(0,4);

    const nav = props.data.nav;

    async function refreshData(){
        setRefreshing(true)
        await props.data.reloadData().then((data)=> {
        console.log("Finishing Refresh")
        setRefreshing(false)
        })
    }


    const onEndReached = () => {
        // getMoreData();
    }

    return (<>
        <View style={styles.container}>
            <Text style={styles.title}>News</Text>
            <ScrollView 
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={()=>{refreshData()}
                  } colors={[COLORS.FOREGROUND]} progressBackgroundColor={COLORS.BACKGROUND_HIGHLIGHT}/>
                }>
                
                <View style={styles.sectionContainer}>
                    <TouchableOpacity onPress={() => {nav.navigate('All News', {data:userContext.news})}}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Articles</Text>
                            <View style={styles.seeMoreSection}>
                                <Text style={styles.seeMoreText}>Read More</Text>
                                <MaterialIcons name="arrow-forward-ios" style={styles.sectionIcon}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* <View style={{height:10}}></View> */}
                    {news.map((item, index) => {return (<Article articleData={item} key={index}/>);})}
                    {/* <Article articleData={news[4]}></Article> */}
                </View>

                <StarshipDashboard/>
                <ISSDashboard/>
                {/* <Text style={styles.eventsTitle}>Events</Text>  */}
                <View style={styles.bottomPadding}></View>
                    
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