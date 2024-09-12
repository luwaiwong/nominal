import { StyleSheet, View, Text, Image, FlatList, StatusBar, ScrollView, Dimensions, Linking, Animated, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons} from 'react-native-vector-icons';
import { BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT } from '../../styles';
import Event from 'src/components/Event';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from "src/utils/UserContext";
import LaunchSimple from 'src/components/LaunchSmall';
import WebView from 'react-native-webview';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Gesture, GestureDetector, TouchableOpacity } from 'react-native-gesture-handler';
import Launch from 'src/components/Launch';
import LaunchHighlight from 'src/components/HighlightLaunch';
import StarbaseWeather from 'src/components/starship/StarbaseWeather';

export function StarshipDashboard(){
    const userContext = useContext(UserContext);
    const oldData = useRef(null);
    const [data, setData] = useState(undefined);

    
    async function getData(){
        // console.log("Getting starship data")
        await userContext.getStarshipData().then((data) => {
            if (data.upcoming == undefined){
                console.log("Starship data is undefined")
            }

            if (oldData.current != undefined && JSON.stringify(oldData.current) == JSON.stringify(data)){
                console.log("Starship data is the same")
                return;
            }
            oldData.current = data;
            sortData(data);
        }).catch((error) => {
            Alert.alert("Error getting starship data: "+ error)
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
        
        let isSameAsFeatured = upcominglaunches[0] != undefined && upcominglaunches[0].id ==userContext.launches.upcoming[0].id

        // Set next event to most recent launch or event
        if (upcominglaunches == undefined || upcominglaunches[0] == undefined){
            newData.nextEvent = upcomingevents[0];
        }
        else if ((
            upcomingevents == undefined || upcomingevents[0] == undefined) && !isSameAsFeatured){
            newData.nextEvent = upcominglaunches[0];
        }
        else if (
            (upcominglaunches[0].net < upcomingevents[0].date) && !isSameAsFeatured){
            newData.nextEvent = upcominglaunches[0];
        }
        else if (upcomingevents[0] != undefined){
            newData.nextEvent = upcomingevents[0];
        }
        else if (upcominglaunches[1] != undefined){
            newData.nextEvent = upcominglaunches[1];
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
                <Text style={dstyles.title}>Starship & Starbase Loading...</Text>
            <   StarbaseWeather/>
            </View>
        )
    }

    let infoContainerStyle = {
        marginTop: data.nextEvent != undefined?-25: 0,
        paddingTop: data.nextEvent != undefined? 20: 5,

    }
    return (
        
        <View style={dstyles.container}>
            <TouchableOpacity onPress={() => {userContext.nav.navigate("Starship")}}>
                <View style={dstyles.sectionHeader}>
                    <Text style={dstyles.sectionTitle}>Starship & Starbase</Text>
                    <View style={dstyles.seeMoreSection}>
                        <Text style={dstyles.seeMoreText}>Explore</Text>
                        <MaterialIcons name="arrow-forward-ios" style={dstyles.sectionIcon}/>
                    </View>
                </View>
            </TouchableOpacity>
            <StarbaseWeather/>

            {data != undefined && data.nextEvent != undefined &&
                <View style={dstyles.eventsContainer}>
                    {
                        data.nextEvent != undefined && data.nextEvent.type == "launch" ? <LaunchSimple data={data.nextEvent}></LaunchSimple> :
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

                
            </View>
        </View>
    )
}
export default function StarshipPage(props) {
    const userContext = useContext(UserContext);
    const data = userContext.starship;
    const previousLaunches = [...data.previous.launches].sort((a,b) => {
      let dateA = new Date(a.date).getTime();
      let dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    const previousEvents = [...data.previous.events].reverse();
    // console.log(data.previous.events[0].name)


                //#region Animation & Input for Top Bar
    let upcoming = Gesture.Tap();
    let previous = Gesture.Tap();

    upcoming.onFinalize(()=>toggleSelection("upcoming"));
    previous.onFinalize(()=>toggleSelection("previous"));

    let barMargin = useRef(new Animated.Value(0)).current;
    let inputRange = [0, 100];
    let outputRange = ["5%", "55%"];
    let animatedBarMargin = barMargin.interpolate({inputRange, outputRange});

    let pageMargin = useRef(new Animated.Value(0)).current;
    inputRange = [0,100]
    outputRange = ["0%", "-100%"];
    let animatedPageMargin = pageMargin.interpolate({inputRange, outputRange});

    const [showHeight, setShowHeight] = useState(true);

    const toggleSelection = (selected: string) => {
      if (selected == "upcoming"){
        setShowHeight(true)
        Animated.parallel([
          Animated.timing(barMargin, {
            
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
            
          }),
          Animated.timing(pageMargin, {
            toValue: 0,
            duration: 200, 
            useNativeDriver: false
          })

        ]).start()
      } else if (selected == "previous"){

        Animated.parallel([
          Animated.timing(barMargin, {
            toValue: 100,
            duration: 200,
            useNativeDriver: false,
            
          }),
          Animated.timing(pageMargin, {
            toValue: 100,
            duration: 200, 
            useNativeDriver: false
          })
        ]).start(()=>setShowHeight(false))
      }
      
    }

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

                <StarbaseWeather/>
                <View style={styles.infoUrls}>
                        <TouchableOpacity  onPress={() => Linking.openURL("https://www.youtube.com/watch?v=A8QLrVAOE1k")} >
                            <View style={styles.infoUrl}>
                                <Text style={styles.infoUrlText}>LabPadre</Text>
                                <MaterialCommunityIcons name="video-outline" style={styles.infoUrlIcon} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={() => Linking.openURL("https://www.youtube.com/watch?v=mhJRzQsLZGg")} >
                            <View style={styles.infoUrl}>
                                <Text style={styles.infoUrlText}>NasaSpaceflight</Text>
                                <MaterialCommunityIcons name="video-outline" style={styles.infoUrlIcon} />
                            </View>
                        </TouchableOpacity>
                </View>

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
                <View>
                {
                    userContext.settings.devmode &&
                    <View style={styles.devMode}>
                        <Text style={styles.devText}>Developer Info</Text>
                        <Text style={styles.devText}>Notices: {JSON.stringify(data.notices)}</Text>
                        <Text style={styles.devText}>Road Closures: {JSON.stringify(data.road_closures)}</Text>
                        {/* <Text>Updates: {JSON.stringify(data.updates)}</Text> */}
                    </View>
                }
                <View style={styles.topSelectionContainer}>
                    <GestureDetector gesture={upcoming}>
                        <Text style={styles.topSelectionText}>Vehicles</Text> 
                    </GestureDetector>
                    <GestureDetector gesture={previous}>
                        <Text style={styles.topSelectionText}>Orbiters</Text> 
                    </GestureDetector>
                </View>
                {/* Animated Bar */}
                <Animated.View style={[styles.topSelectionBar, {marginLeft:animatedBarMargin}]}></Animated.View>

                {/* Content Section */}
                <Animated.View style={[styles.contentContainer, {marginLeft:animatedPageMargin}]}>
                <Animated.View style={[styles.contentSection,{height:showHeight?"100%":0, overflow:'hidden'}]}>
                    {data.vehicles.map((vehicle, index) => {
                        return (
                            <Vehicle key={index} data={vehicle}/>
                        )
                    })}
                </Animated.View> 
                    <View style={[styles.contentSection]}>
                        {data.orbiters.map((orbiter, index) => {
                            return (
                                <Orbiter key={index} data={orbiter}/>
                            )
                        })}
                    </View>
                </Animated.View>
                </View> 
        </ScrollView>
    </View>
    )
}
function Vehicle(props){
    const data = props.data;
    const status = data.status;
    let statusColor = COLORS.FOREGROUND;

    if (status == "active"){
        statusColor = COLORS.GREEN;
    }   else if (status == "retired"){
        statusColor = COLORS.SUBFOREGROUND;
    }   else if (status == "destroyed"){
        statusColor = COLORS.RED;
    }   else if (status == "lost"){
        statusColor = COLORS.RED;
    }

    return (
        <View style={styles.vehicleContainer}>
            <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleTitle}>{props.data.serial_number}</Text>
                <Text style={[styles.vehicleStatus,{color:statusColor}]}>{data.status.charAt(0).toUpperCase() + data.status.slice(1)}</Text>
                <Text style={styles.vehicleStatus}>flights: {data.flights}</Text>
            </View>
            <View style={styles.vehicleImage}>
            <Text style={styles.vehicleDetails}>{props.data.details}</Text>
                {data.last_launch_date != null && <Text style={styles.vehicleDate}>Last Launched {new Date(data.last_launch_date).toLocaleString([],{day:'numeric', month: 'long', year:'numeric' })}</Text>}

            </View>
            {/* {<Image source={{uri: data.image_url}} style={styles.vehicleImage }/> } */}
        </View>
    )
}

function Orbiter(props){
    const data = props.data;
    const status = data.status.name;
    let statusColor = COLORS.FOREGROUND;

    if (status == "Active"){
        statusColor = COLORS.GREEN;
    }   else if (status == "Retired"){
        statusColor = COLORS.SUBFOREGROUND;
    }   else if (status == "Destroyed"){
        statusColor = COLORS.RED;
    }

    return (
        <View style={styles.vehicleContainer}>

            <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleTitle}>{props.data.name}</Text>
                <Text style={[styles.vehicleStatus,{color:statusColor}]}>{data.status.name}</Text>
                <Text style={styles.vehicleStatus}>Flights: {data.flights_count}</Text>
            </View>
            <View style={styles.vehicleImage}>
            
                <Text style={styles.vehicleDetails}>{data.description}</Text>

            </View>
            {/* {<Image source={{uri: data.spacecraft_config.image_url}} style={styles.vehicleImage }/> } */}
        </View>
    )

}
const dstyles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // width: '100%',
        backgroundColor : COLORS.BACKGROUND_HIGHLIGHT,
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    title:{
        fontSize: 19,
        color: COLORS.FOREGROUND,
        width: "100%",

        fontFamily: FONT,

        marginBottom: 12,
        marginLeft: 10,
        marginTop: 10,
    },
    // SECTION HEADERS
    sectionHeader:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 12,
        // marginTop: -5,
        paddingTop: 5,
        marginBottom: 10,
    },
    sectionTitle:{
        fontSize: 19,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
    seeMoreText:{
        fontSize: 18,
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
        // marginBottom:2,
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
    eventsContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',

        // backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        // marginHorizontal: 10,
    

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
        marginTop: -12,
        // marginBottom: 20,
        
    },
    infoUrl:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        marginRight: 10,
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
    back:{
        position: 'absolute',
        width: 30,
        marginLeft: 10,

        fontSize: 26,
        color: COLORS.FOREGROUND,
        zIndex: 200,
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

    // Top Upcoming and Previous Selection Area
    topSelectionContainer:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 5,
      marginBottom: 5,
      marginTop: 10,
    },
    topSelectionText:{
      fontSize: 24,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      width: '50%',
      textAlign: 'center',
    },
    topSelectionBar:{
      width: '40%',
      height: 2,
      backgroundColor: COLORS.FOREGROUND,
      borderRadius: 100,
      marginBottom: 10,
      marginLeft: "5%",
    
    },
    bottomPadding:{
      height: BOTTOM_BAR_HEIGHT+20,
      width: "100%",
    },

    // Content Section
    contentContainer:{
      display: 'flex',
      flexDirection: 'row',
      // position: 'absolute',
      marginLeft: "0%",
      width: "200%",
    //   height: Dimensions.get('window').height-StatusBar.currentHeight,
    //   paddingBottom: BOTTOM_BAR_HEIGHT,
      
      overflow: "hidden",
    },
    contentSection: {
      display: 'flex',
      backgroundColor: COLORS.BACKGROUND,
      // marginBottom: BOTTOM_BAR_HEIGHT+250,
      // overflow: 'hidden',
      flex: 1
    },
    vehicleContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        // justifyContent: 'center',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        marginHorizontal: 10,
        borderRadius: 10,
        marginTop: 10,
        // marginBottom: 10,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    vehicleInfo:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: "40%",
    },
    vehicleTitle:{
        fontSize: 22,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
    vehicleStatus:{
        fontSize: 14,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
    vehicleDate:{
        fontSize: 14,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
    vehicleDetails:{
        fontSize: 12,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginRight: 10,
        // width: "40%",
    },
    vehicleImage:{
        width: "60%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 10,
    },
    devMode:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        marginHorizontal: 10,
        borderRadius: 10,
        marginTop: 10,
        // marginBottom: 10,
        padding: 10,
    },
    devText:{
        fontSize: 14,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginBottom: 5,
    }
})