
import { ScrollView, StatusBar, StyleSheet, Text, View, Animated, Pressable, Dimensions, RefreshControl} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT } from "../styles";

import Article from "../styled/Article";
import Event from "../styled/Event";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../data/UserContext";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import ArticleDescriptive from "../styled/ArticleDescriptive";
const NEWS_API_URL = "https://api.spaceflightnewsapi.net/v4/";

export default function News(props){
    let userContext = useContext(UserContext);
    let callingData = useRef(false);
    let currentOffset = useRef(10);
    let upcomingEvents = userContext.events.upcoming;
    let previousEvents = userContext.events.previous;
    const [data, setData] = useState(null);

    const nav = props.data.nav;

    const [refreshing, setRefreshing] = useState(false)
    async function refreshData(){
        setRefreshing(true)
        await props.data.reloadData().then((data)=> {
        console.log("Finishing Refresh")
        setRefreshing(false)
        })
    }

    useEffect(() => {
        if (userContext != null && userContext.news != null){
            setData(userContext.news.slice(0,4))
        }
    }, [])

    const onEndReached = () => {
        // getMoreData();
    }

    async function getMoreData(){
        if (callingData.current){
            return
        }

        callingData.current = true;
        await fetch(NEWS_API_URL+"articles/?offset="+currentOffset.current).then((response) => {
            return response.json()
        }).then((articles) => {
            if (articles == null){
                console.log("Article data null")
                callingData.current = false;
                return
            }
            setData([...data,...articles.results])
            currentOffset.current = currentOffset.current + 10;
            callingData.current = false;
        }).catch((error) => {
            console.log("Error fetching article data", error)
            callingData.current = false;
        })
    }

    if (data == null){
        return (<></>)
    }
    return (<>
        <View style={styles.container}>
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
                    <View style={{height:10}}></View>
                    {data != undefined && data.map((item, index) => {return (<Article articleData={item} key={index}/>);})}
                    {/* <Article articleData={news[4]}></Article> */}
                </View>


                {upcomingEvents != undefined && upcomingEvents.length != 0 && 
                <View style={styles.sectionContainer}>
                    <TouchableOpacity onPress={() => {nav.navigate('Events', {data:upcomingEvents})}}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Upcoming Events</Text>
                            <View style={styles.seeMoreSection}>
                                <Text style={styles.seeMoreText}>See All</Text>
                                <MaterialIcons name="arrow-forward-ios" style={styles.sectionIcon}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {upcomingEvents != undefined && upcomingEvents.slice(0,2).map((item, index) => {return (<Event nav={nav} eventData={item} key={index}/>);})}        
                </View>
                }
                {previousEvents != undefined && previousEvents.length != 0 && 
                <View style={styles.sectionContainer}>
                    <TouchableOpacity onPress={() => {nav.navigate('Events', {data:previousEvents})}}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Events</Text>
                            <View style={styles.seeMoreSection}>
                                <Text style={styles.seeMoreText}>See All</Text>
                                <MaterialIcons name="arrow-forward-ios" style={styles.sectionIcon}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {previousEvents != undefined && previousEvents.slice(0,1).map((item, index) => {return (<Event nav={nav} eventData={item} key={index}/>);})}        
                </View>
                }

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
    bottomPadding:{
        height: BOTTOM_BAR_HEIGHT,
    },
    
})