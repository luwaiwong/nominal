import { StyleSheet, View, Text, Image, FlatList, StatusBar, ScrollView, Dimensions, Linking } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons} from 'react-native-vector-icons';
import { COLORS, FONT, TOP_BAR_HEIGHT } from '../../../styles';
import Event from '../../../styled/Event';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../data/UserContext';
import LaunchSimple from '../../../styled/LaunchSimple';
import WebView from 'react-native-webview';
import YoutubeIframe from 'react-native-youtube-iframe';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Launch from '../../../styled/Launch';
import LaunchHighlight from '../../../styled/HighlightLaunch';

export function StarshipDashboard(){
    const userContext = useContext(UserContext);
    const [data, setData] = useState(undefined);

    
    async function getData(){
        // console.log("Getting starship data")
        await userContext.getStarshipData().then((data) => {
            if (data.upcoming == undefined){
                console.log("Data is undefined")
            }
            sortData(data);
        }).catch((error) => {
            console.log("Error getting starship data:", error);
        })
    }

    function sortData(data){
        let newData = data
        let today = new Date().getTime();
        
        if (data.upcoming == undefined){
            return;
        }

        let upcominglaunches = data.upcoming.launches;
        let upcomingevents = data.upcoming.events;

        // Set next event to most recent launch or event
        if (upcominglaunches == undefined || upcominglaunches[0] == undefined){
            newData.nextEvent = upcomingevents[0];
        }
        else if (upcomingevents == undefined || upcomingevents[0] == undefined){
            newData.nextEvent = upcominglaunches[0];
        }
        else if (upcominglaunches[0].net < upcomingevents[0].date){
            newData.nextEvent = upcominglaunches[0];
        }
        else{
            newData.nextEvent = upcomingevents[0];
        }
        newData.nextEvent = upcominglaunches[0]

        let previousevent = data.previous.events.at(-1);
        let previouslaunch = data.previous.launches.at(-1);

        
        // Set next event to most recent launch or event
        if (previouslaunch == undefined ){
            newData.lastEvent = previousevent;
        }
        else if (previousevent == undefined){
            newData.lastEvent = previouslaunch;
        }
        else if (new Date(previouslaunch.net).getTime()-today > new Date(previousevent.date).getTime()-today){
            newData.lastEvent = previouslaunch;
        }
        else{
            newData.lastEvent = previousevent;
        }

        
        setData(newData)

    }

    useEffect(() => {
        if (userContext != undefined){
            getData();
        }
    }, [userContext])

    if (data == undefined) {
        return (
            <View style={dstyles.container}>
                <Text style={dstyles.title}>Starship Loading...</Text>
            </View>
        )
    }

    let infoContainerStyle = {
        marginTop: data.nextEvent != undefined?-25: 0,
        paddingTop: data.nextEvent != undefined? 20: 5,

    }
    return (
        
        <View style={dstyles.container}>
            {data != undefined && data.nextEvent != undefined &&
                <View style={dstyles.eventsContainer}>
                    {
                        data.nextEvent != undefined && data.nextEvent.type == "launch" ? <LaunchHighlight data={data.nextEvent}></LaunchHighlight> :
                        <Event eventData={data.nextEvent}></Event>
                    }
                </View>
            }
            <View style={[dstyles.infoContainer, infoContainerStyle]}>


                {data != undefined && data.lastEvent != undefined && data.nextEvent == undefined &&
                    <View >
                        <Text style={dstyles.eventsTitle}>
                            Last Starship Event:
                        </Text>
                        {
                            data.lastEvent != undefined && data.lastEvent.type == "launch" ? <LaunchSimple data={data.lastEvent}></LaunchSimple> :
                            <Event eventData={data.lastEvent}></Event>
                        }
                    </View>
                }
                <TouchableOpacity onPress={() => {userContext.nav.navigate("Starship")}}>
                    <View style={dstyles.sectionHeader}>
                        <Text style={dstyles.sectionTitle}>Starship & Starbase</Text>
                        <View style={dstyles.seeMoreSection}>
                            <Text style={dstyles.seeMoreText}>See More</Text>
                            <MaterialIcons name="arrow-forward-ios" style={dstyles.sectionIcon}/>
                        </View>
                    </View>
                </TouchableOpacity>

                
            </View>
        </View>
    )

}
export default function StarshipPage(props) {
    const userContext = useContext(UserContext);
    const data = userContext.starship;
    const previousLaunches = data.previous.launches;
    const previousEvents = [...data.previous.events].reverse();
    // console.log(data.previous.events[0].name)



    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <MaterialIcons 
                    name="arrow-back-ios" 
                    style={styles.back} 
                    onPress={() => props.navigation.goBack()}>
                </MaterialIcons>
                <Text style={styles.title}>Starship & Starbase</Text>
            </View>
            <ScrollView>
                {/* <View style={dstyles.streamContainer} >
                    <YoutubeIframe videoId='A8QLrVAOE1k' width={Dimensions.get("window").width} height={Dimensions.get("window").width*1} play={false} mute={true} />
                </View> */} 

                <View style={styles.infoUrls}>
                        <TouchableOpacity  onPress={() => Linking.openURL("https://www.youtube.com/watch?v=mhJRzQsLZGg")} >
                            <View style={styles.infoUrl}>
                                <Text style={styles.infoUrlText}>LabPadre</Text>
                                <MaterialCommunityIcons name="video-outline" style={styles.infoUrlIcon} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={() => Linking.openURL("https://www.youtube.com/watch?v=A8QLrVAOE1k")} >
                            <View style={styles.infoUrl}>
                                <Text style={styles.infoUrlText}>NasaSpaceflight</Text>
                                <MaterialCommunityIcons name="video-outline" style={styles.infoUrlIcon} />
                            </View>
                        </TouchableOpacity>

                </View>

                {/* {
                    data.upcoming.launches[0] != null &&
                    <LaunchHighlight data={data.upcoming.launches[0]}></LaunchHighlight>
                } */}
                {/* <Text style={styles.description}>Future and past Starship events </Text> */}
                {/* Upcoming Launches */}{
                    data.upcoming.launches[0] != null && 
                    <View style={styles.section}>
                    <TouchableOpacity onPress={()=>{userContext.nav.navigate('Launches', {data: data.upcoming.launches,title:"Upcoming Starship Launches" })}}>
                        <View style={styles.contentHeaderSection} >
                            <Text style={styles.contentHeaderText} >Next Launch</Text>
                            <View style={styles.seeMoreSection}>
                            <Text style={styles.contentSeeMore} >See All </Text>
                            <MaterialIcons 
                            name="arrow-forward-ios" 
                            style={styles.contentHeaderIcon} 
                            />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <LaunchSimple data={data.upcoming.launches[0]}></LaunchSimple>
                    </View>
                }
                <View style={styles.section}>
                  <TouchableOpacity onPress={()=>{userContext.nav.navigate('Launches', {data: previousLaunches,title:"Previous Starship Launches" })}}>
                    <View style={styles.contentHeaderSection} >
                        <Text style={styles.contentHeaderText} >Previous Launch</Text>
                        <View style={styles.seeMoreSection}>
                          <Text style={styles.contentSeeMore} >See All </Text>
                          <MaterialIcons 
                          name="arrow-forward-ios" 
                          style={styles.contentHeaderIcon} 
                          />
                        </View>
                    </View>
                  </TouchableOpacity>
                  <LaunchSimple data={previousLaunches[0]}></LaunchSimple>
                </View>
                {/* <Text style={styles.sectionTitle}>Events:</Text> */}
                {/* Upcoming Launches */}
                {
                data.upcoming != null && data.upcoming.events != null && data.upcoming.events[0] != null &&
                <View style={styles.section}>
                  <TouchableOpacity onPress={()=>{userContext.nav.navigate('Events', {data: data.upcoming.events})}}>
                    <View style={styles.contentHeaderSection} >
                        <Text style={styles.contentHeaderText} >Upcoming Event</Text>
                        <View style={styles.seeMoreSection}>
                          <Text style={styles.contentSeeMore} >See All </Text>
                          <MaterialIcons 
                          name="arrow-forward-ios" 
                          style={styles.contentHeaderIcon} 
                          />
                        </View>
                    </View>
                  </TouchableOpacity>
                  <Event eventData={data.upcoming.events[0]}></Event>
                </View>
                }
                {
                data.previous != null && data.previous.events != null && data.previous.events[0] != null &&
                    <View style={styles.section}>
                        <TouchableOpacity onPress={()=>{userContext.nav.navigate('Events', {data: previousEvents,title:"Previous Events" })}}>
                            <View style={styles.contentHeaderSection} >
                                <Text style={styles.contentHeaderText} >Recent Event</Text>
                                <View style={styles.seeMoreSection}>
                                <Text style={styles.contentSeeMore} >See All </Text>
                                <MaterialIcons 
                                name="arrow-forward-ios" 
                                style={styles.contentHeaderIcon} 
                                />
                                </View>
                            </View>
                        </TouchableOpacity>
                    <Event eventData={previousEvents[0]}></Event>
                    </View> 
                }
                

                {
                    userContext.settings.devmode &&
                    <View>
                        <Text>Notices: {JSON.stringify(data.notices)}</Text>
                        <Text>Road Closures: {JSON.stringify(data.road_closures)}</Text>
                    </View>
                }
            </ScrollView>
        </View>
    )
}
function Vehicle(props){
    return (
        <View>
            <Text>{props.data.name}</Text>
        </View>
    )
}

function Orbiter(props){
    return (
        <View>
            <Text>{props.data.name}</Text>
        </View>
    )

}
const dstyles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // width: '100%',
        // backgroundColor : COLORS.BACKGROUND_HIGHLIGHT,
        // marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 10,
        overflow: 'hidden',

        // padding: 10
        
        // zIndex: 100,
    },
    title:{
        fontSize: 26,
        color: COLORS.FOREGROUND,
        width: "100%",

        fontFamily: FONT,

        marginBottom: 10,
    },
    image: {
        width: "100%",
        aspectRatio: 1.5,
        borderRadius: 10,
        // margin: 10,
    },
    // SECTION HEADERS
    sectionHeader:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 11,
        // marginTop: -5,
        paddingTop: 5,
        marginBottom: 5,
    },
    sectionTitle:{
        fontSize: 19,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
    seeMoreText:{
        fontSize: 16,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
        marginRight: 5,
        alignContent: 'flex-end',
    },
    sectionIcon:{
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
        // marginBottom: 2,
        // marginRight: 10,
    },
    seeMoreSection:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        marginBottom:2,
    },
    infoContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        marginHorizontal: 10,
        borderRadius: 10,
        // marginTop: -20,
        marginBottom: 10,
        // padding: 10,
        paddingTop: 5,
        // elevation: 10,
        zIndex: -10,
    },
    streamContainer:{
        width: '100%',
        aspectRatio: 16/9,
        borderRadius: 10,
        overflow: 'hidden',
        // marginBottom: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    streamCredit:{
        fontSize: 14,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
        marginRight: 10,
        // marginBottom: 5,
        width: '100%',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
    },
    eventsContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',

        // backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    

    },
    eventsTitle:{
        fontSize: 16,
        color: COLORS.SUBFOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginBottom: -5,
        marginLeft: 12,
        // marginTop: 10,
        zIndex: 100,
    },
    subInfoContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        // paddingHorizontal: 11,
        // marginBottom: 5,
    },
    sourceText:{
        fontSize: 14,
        color: COLORS.SUBFOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
        textAlignVertical: 'bottom',
        marginHorizontal: 10,
        
        marginTop: 2,
        marginLeft: 12,
        height: "100%",
    },
    
})
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        backgroundColor : COLORS.BACKGROUND,
        // zIndex: 100,
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
        fontSize: 26,
        color: COLORS.FOREGROUND,
        width: "100%",
        textAlign: 'center',
        alignContent: 'center',

        fontFamily: FONT,

        marginBottom: 10,
    },
    infoUrls:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        width: "100%",
        marginLeft: 11,
        // marginTop: 5,
        // marginBottom: 20,
        
    },
    infoUrl:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        marginRight: 5,
        marginTop: 10,
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    infoUrlText:{
        
      fontSize: 14,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
      backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
      borderRadius: 10,

    },
    infoUrlIcon:{
      fontSize: 25,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
      marginLeft: 5,
      marginTop: 2,
    },
    description: {
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        marginHorizontal: 15,

    },
    back:{
        position: 'absolute',
        width: 30,
        marginLeft: 10,

        fontSize: 26,
        color: COLORS.FOREGROUND,
        zIndex: 200,
    },
    image: {
        width: "100%",
        aspectRatio: 1,
    },
    sectionTitle:{
        fontSize: 26,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginHorizontal: 16,
        marginTop: 10,
    },
    section:{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        marginHorizontal: 10,
        borderRadius: 10,

        marginTop: 10,

        // width: '100%',
        
        
    },
    contentHeaderSection:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',

        
        width: '100%',
        paddingHorizontal: 11,
        marginBottom: 5,
        marginTop: 2,
    },
    contentHeaderText:{
        fontSize: 22,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
    contentSeeMore:{
        fontSize: 16,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
        marginRight: 5,
        alignContent: 'flex-end',
    },
    contentHeaderIcon:{
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
    },
    seeMoreSection:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 3,
    },
    sectionIcon:{
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
    },
})