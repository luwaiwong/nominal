import { StyleSheet, View, Text, Image, FlatList, StatusBar, Dimensions, ScrollView, Linking, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { COLORS, FONT, TOP_BAR_HEIGHT } from '../../../styles';
import Event from '../../../styled/Event';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../data/UserContext';
import LaunchSimple from '../../../styled/LaunchSimple';
import { WebView } from 'react-native-webview';
import { TouchableOpacity } from 'react-native-gesture-handler';
import YoutubeIframe from 'react-native-youtube-iframe';
import { processIndividualLaunchData, processLaunchData } from '../../../data/APIHandler';

const highDefStream= "P9C25Un7xaM"
const lowDefStream= "VdFK-xs_r-4"
const streamID = highDefStream
export function ISSDashboard(){
    const userContext = useContext(UserContext);
    const [data, setData] = useState(undefined);
    let launches = undefined;
    let events = undefined;

    function getISSrelated(){
        launches = userContext.launches;
        events = userContext.events;
        let e = [];

        if (events != undefined && events.upcoming != undefined)
        {
            e = events.upcoming.filter((event) => {
                // Loop through the programs
                let programs = event.program;
                for (let i = 0; i < programs.length; i++){
                    if (programs[i].name == "International Space Station"){
                        return true;
                    }
                }
                return false;
            })
        }

        let l = [];
        if (launches != undefined && launches.upcoming != undefined){
            l = launches.upcoming.filter((launch) => {
                // Loop through the programs
                let programs = launch.program;
                for (let i = 0; i < programs.length; i++){
                    if (programs[i].name == "International Space Station"){
                        return true;
                    }
                }
                return false;
            })
        }

        // Sort the events by date
        let result = [];
        
        while (e.length != 0 && l.length != 0){
            if (e[0].date < l[0].net){
                e[0].type = "event";
                result.push(e.shift());
            } else {
                l[0].type = "launch";
                result.push(l.shift());
            }
        }
        while (e.length != 0){
            e[0].type = "event";
            result.push(e.shift());
        }
        while (l.length != 0){
            l[0].type = "launch";
            result.push(l.shift());
        }

        // Check if precise
        // return undefined
        if (result[0] != undefined){
            if (result[0].type == "event" && result[0].date_precision != null && result[0].date_precision.name != "Month"){
                return result[0];
            }
            else if (result[0].type == "launch" && result[0].net_precision != null && result[0].net_precision.name != "Month"){
                return result[0];
            }
        }
        console.log("No ISS related events")
        return undefined
    }
    
    // Getting ISS data
    async function getData(){
        // console.log("Getting ISS data")
        await userContext.getISSData().then((data) => {
            if (data == undefined){
                console.log("No ISS data")
                return;
            }

            data.related = getISSrelated();
            // Check docked vehicles
            data.docked_vehicles = 0;
            for (let i = 0; i < data.docking_location.length; i++){
                if (data.docking_location[i].docked != null){
                    data.docked_vehicles++;
                }
            }
            
            setData(data);
        }).catch((error) => {
            Alert.alert("Error getting ISS data: " + error)
        })
    }

    useEffect(() => {
        if (userContext != undefined){
            getData();
        }
    }, [])

    // Check if need to get iss data
    if (data == undefined) {
        return (
            <View style={dstyles.container}>
                <Text style={dstyles.title}>ISS Loading...</Text>
            </View>
        )
    }
    return (
        <View style={dstyles.container}>
                <TouchableOpacity onPress={() => {userContext.nav.navigate("ISS")}}>
                    {/* <Text style={dstyles.sourceText}>Live Source: ESA</Text>   */}
                    <View style={dstyles.sectionHeader}>
                        <Text style={dstyles.sectionTitle}>International Space Station</Text>
                        <View style={dstyles.seeMoreSection}>
                            <Text style={dstyles.seeMoreText}>Explore</Text>
                            <MaterialIcons name="arrow-forward-ios" style={dstyles.sectionIcon}/>
                        </View>
                    </View>
                </TouchableOpacity>
                <LiveData data={data} />
                <View style={dstyles.infoContainer}>
                        {/* <View style={dstyles.issMapContainer} pointerEvents='none'>
                            <WebView source={{uri: 'http://wsn.spaceflight.esa.int/iss/index_portal.php'}} style={dstyles.issMap} scrollEnabled={false} cacheEnabled={true} cacheMode='LOAD_CACHE_ELSE_NETWORK'/>
                        </View>
                        <View style={dstyles.subInfoContainer}>
                            <Text style={dstyles.sourceText}>Live ISS Position: ESA</Text>
                        </View> */}
                    {data.related != undefined && false && 
                    <View style={dstyles.relatedSection}> 
                        {/* <Text style={dstyles.subtitle}>Next ISS Event:</Text> */}
                        {data.related.type == "event" ? 
                            <Event  eventData={data.related}/>:
                            <LaunchSimple  data={data.related}/>
                            
                        }
                    </View>}
                    
                </View>
        </View>
    )

}


    function LiveData(props){
        const userContext = useContext(UserContext);
        const [liveData, setLiveData] = useState(undefined);
        const update = props.update
        let launches = null;
        let events = null;

        async function getISSPositionData(){
            await fetch("https://api.wheretheiss.at/v1/satellites/25544").then((data) => {
                return data.json();
            }).then((data)=>{
                // console.log("ISS Data:", data);
                setLiveData(data);
            }).catch((error) => {
                console.log("Error getting ISS data:", error);
            })
        }

        useEffect(() => {
            
            getISSPositionData();
            
            let updateTime = 5000;
            if (update != undefined){
                updateTime = update;
            }
            // Set timer to reload live data
            const interval = setInterval(() => {
                getISSPositionData();
            }, updateTime);
            return () => clearInterval(interval);

            
        }, [props.data])

        if (liveData == undefined || props.data == undefined){
            return (
                <View style={dstyles.statsContainer}>
                    <Text style={dstyles.statsText}>Loading Live Data...</Text>
                </View>
            )
        }
        return (
            <View style={dstyles.statsSection}> 
                <Text style={dstyles.statsTitle}>Current:</Text>
                <View style={dstyles.statsContainer}>
                    <Text style={dstyles.statsText}>Altitude: {liveData.altitude.toFixed(1)}km</Text>
                    <Text style={dstyles.statsText}>Longitude: {liveData.longitude.toFixed(1)}</Text>
                    <Text style={dstyles.statsText}>Velocity: {liveData.velocity.toFixed(1)}km/s</Text>
                    <Text style={dstyles.statsText}>Latitude: {liveData.latitude.toFixed(1)}</Text>
                    <Text style={dstyles.statsText}>Crew: {props.data.onboard_crew}</Text>
                    <Text style={dstyles.statsText}>Docked Spacecraft: {props.data.docked_vehicles}</Text>
                </View>
                {/* <Text style={dstyles.statsTitle}>Live Data:</Text> */}
            </View>
        )

    }

// Assume ISS data has already been loading from widge
export default function ISSPage(props) {
    const userContext = useContext(UserContext);
    const [liveData, setLiveData] = useState(undefined);
    const [descriptionShown, setDescriptionShown] = useState(false);
    let iss = userContext.iss
    let description = iss.description;
    description = description.replace(/(\.[^.]*\.)/g, '$1 \n\n');

    let stats = {
        orbit: iss.orbit,
        founded: iss.founded,
        height: iss.height,
        width: iss.width,
        mass: iss.mass,
        volume: iss.volume
    }

    const [launches, setLaunches] = useState({upcoming: [], previous: []});
    const [events, setEvents] = useState({upcoming: [], previous: []});

    useEffect(() => {
        // Set data

        let eu = [];
        let ep = [];
        let lu = [];
        let lp = [];

        if (userContext.events != undefined && userContext.events.upcoming != undefined)
        {
            eu = userContext.events.upcoming.filter((event) => {
                // Loop through the programs
                let programs = event.program;
                for (let i = 0; i < programs.length; i++){
                    if (programs[i].name == "International Space Station"){
                        return true;
                    }
                }
                return false;
            })
        }

        if (userContext.launches != undefined && userContext.launches.upcoming != undefined){
            lu = userContext.launches.upcoming.filter((launch) => {
                // Loop through the programs
                let programs = launch.program;
                for (let i = 0; i < programs.length; i++){
                    if (programs[i].name == "International Space Station"){
                        return true;
                    }
                }
                return false;
            })
        }

        if (userContext.events != undefined && userContext.events.previous != undefined)
        {
            ep = userContext.events.previous.filter((event) => {
                // Loop through the programs
                let programs = event.program;
                for (let i = 0; i < programs.length; i++){
                    if (programs[i].name == "International Space Station"){
                        return true;
                    }
                }
                return false;
            })
        }



        if (userContext.launches != undefined && userContext.launches.previous != undefined){
            lp = userContext.launches.previous.filter((launch) => {
                // Loop through the programs
                let programs = launch.program;
                for (let i = 0; i < programs.length; i++){
                    if (programs[i].name == "International Space Station"){
                        return true;
                    }
                }
                return false;
            })
        }

        setLaunches({upcoming: lu, previous: lp});
        setEvents({upcoming: eu, previous: ep});

    }, [])

    // console.log("ISS Data:", Object.keys(iss.docking_location[4].docked.flight_vehicle.launch))
    // console.log(iss.docking_location[4].docked.flight_vehicle.launch)
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <MaterialIcons 
                    name="arrow-back-ios" 
                    style={styles.back} 
                    onPress={() => props.navigation.goBack()}>
                </MaterialIcons>
                <Text style={styles.title}>International Space Station</Text>
            </View>
            <ScrollView>
                <View style={styles.issMapContainer} pointerEvents='none'>
                    <WebView source={{uri: 'http://wsn.spaceflight.esa.int/iss/index_portal.php'}} style={styles.issMap} scrollEnabled={false} cacheEnabled={true} cacheMode='LOAD_CACHE_ELSE_NETWORK'/>
                </View>
                <View style={dstyles.subInfoContainer}>
                    <Text style={dstyles.sourceText}>ISS Live Position: ESA</Text>
                    {/* <Text style={dstyles.sourceText}>ISS Livestream: NASA</Text> */}
                </View>
                <View style={styles.infoUrls}>
                        <TouchableOpacity  onPress={() => Linking.openURL("https://www.youtube.com/watch?v=P9C25Un7xaM")} >
                            <View style={styles.infoUrl}>
                                <Text style={styles.infoUrlText}>HD Live Views</Text>
                                <MaterialCommunityIcons name="video-outline" style={styles.infoUrlIcon} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={() => Linking.openURL("https://www.youtube.com/watch?v=VdFK-xs_r-4")} >
                            <View style={styles.infoUrl}>
                                <Text style={styles.infoUrlText}>Live Video</Text>
                                <MaterialCommunityIcons name="video-outline" style={styles.infoUrlIcon} />
                            </View>
                        </TouchableOpacity>
                </View>
                
                <LiveData data={iss}/>

                <TouchableOpacity onPress={()=>setDescriptionShown(!descriptionShown)}> 
                    <Text style={styles.subtitle} numberOfLines={3}>Description:</Text>
                    <Text style={styles.description} numberOfLines={descriptionShown?100:5} >{'\t'}{description}</Text>
                </TouchableOpacity>

                <View style={dstyles.statsContainer}>
                    <Text style={dstyles.statsText}>Height: {iss.height}</Text>
                    <Text style={dstyles.statsText}>Mass: {iss.mass}</Text>
                    <Text style={dstyles.statsText}>Width: {iss.width}</Text>
                    <Text style={dstyles.statsText}>Volume: {iss.volume}</Text>
                    <Text style={dstyles.statsText}>Founded: {iss.founded}</Text>
                    <Text style={dstyles.statsText}>Orbit: {iss.orbit}</Text>
                </View>
                {/* Show recent, upcoming events and launches */}

                {/* Upcoming Launches */}{
                    launches.upcoming[0] != null && 
                    <View style={styles.section}>
                    <TouchableOpacity onPress={()=>{userContext.nav.navigate('Launches', {data: launches.upcoming,title:"Upcoming ISS Launches" })}}>
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
                    <LaunchSimple data={launches.upcoming[0]}></LaunchSimple>
                    </View>
                }
                { launches.previous[0] != null && 
                <View style={styles.section}>
                  <TouchableOpacity onPress={()=>{userContext.nav.navigate('Launches', {data: launches.previous,title:"Previous Starship Launches" })}}>
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
                  <LaunchSimple data={launches.previous[0]}></LaunchSimple>
                </View>}
                {/* <Text style={styles.sectionTitle}>Events:</Text> */}
                {/* Upcoming Launches */}
                {
                 events.upcoming[0] != null &&
                <View style={styles.section}>
                  <TouchableOpacity onPress={()=>{userContext.nav.navigate('Events', {data: events.upcoming})}}>
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
                  <Event eventData={events.upcoming[0]}></Event>
                </View>
                }
                {
                events.previous[0] != null &&
                <View style={styles.section}>
                  <TouchableOpacity onPress={()=>{userContext.nav.navigate('Events', {data: events.previous,title:"Previous Events" })}}>
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
                  <Event eventData={events.previous[0]}></Event>
                </View> 
                }
                <View>
                    <Text style={styles.dockTitle}>Currently Docked Vehicles:</Text>
                    {iss.docking_location.map((dock, index) => {
                        if (dock.docked != null){
                            let launch = processIndividualLaunchData(dock.docked.flight_vehicle.launch)
                            return (
                                <View style={styles.dockContainer} key={index}>
                                    <Text style={styles.dockName}>{dock.name}</Text>
                                    <Text style={styles.dockTime}>Docked {new Date(dock.docked.docking).toLocaleString([], {day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit'})}</Text>
                                    {/* <Text style={dstyles.subtitle}>{dock.docked.flight_vehicle.spacecraft.name}</Text> */}
                                    <LaunchSimple data={launch} />
                                </View>
                            )
                        }
                    })}
                </View>
            </ScrollView>
            
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
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
        // marginBottom: 10,
        // marginTop: 10,
        // paddingTop: 10,

        // padding: 10
        
        // zIndex: 100,shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        // elevation: 5,
    },
    title:{
        fontSize: 19,
        color: COLORS.FOREGROUND,
        width: "100%",

        fontFamily: FONT,

        // marginBottom: 15,
        marginTop: 10,
        marginBottom: 12,
        marginLeft: 15,
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
        paddingHorizontal: 12,
        marginTop: 5,
        // marginHorizontal: 10,
        marginBottom: 5,
    },
    sectionTitle:{
        fontSize: 19,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        // marginBottom: 1,
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
        // marginRight: 10,
        // marginBottom: 2,
    },
    seeMoreSection:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        // marginBottom: 1,
        // backgroundColor: 'white',
        
    },
    infoContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
        marginBottom: 10,
        // padding: 10,
    },
    
    issMapContainer:{
        flex: 1,
        width: Dimensions.get('window').width-20,
        // width: "100%",
        aspectRatio: 2.125,
        // margin: 10,
        borderRadius: 10,
        
        overflow: 'hidden',
        // marginTop: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    issMap:{
        width: Dimensions.get('window').width-20,
        // paddingRight: "2.5%",
        aspectRatio: 2.125,
    },
    subtitle:{
        fontSize: 16,
        color: COLORS.SUBFOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginLeft: 10,
        marginTop: 10,
    },
    subInfoContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 5,
        // marginBottom: 5,
    },
    sourceText:{
        fontSize: 14,
        color: COLORS.SUBFOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        textAlignVertical: 'bottom',
        // backgroundColor: 'white',
        // width: '100%',
        height: "100%",
        // marginTop: 5,
        marginHorizontal: 8,
        marginTop: 2,
        // marginLeft: 13,
        // marginBottom: 10,
    },
    
    relatedSection:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        width: Dimensions.get("window").width-20,
        borderRadius: 10,
        
        // borderTopLeftRadius: 0,
        // borderTopRightRadius: 0,
        // marginTop: 10,
    },
    statsSection:{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        // width: '100%',
        // marginBottom: 10,
        marginHorizontal: 8,
        // backgroundColor: 'white',
        // paddingBottom: 15,
        // margin: 10,
        marginTop: 10,
        borderWidth: 3,
        borderColor: COLORS.BACKGROUND,
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,

        borderRadius: 11,
    },
    statsContainer:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        // width: '100%',
        // paddingBottom: 10,
        // backgroundColor: 'white',
        padding: 10,
        // margin: 10,
        borderRadius: 10,
        // borderWidth: 3,
        // borderColor: COLORS.BACKGROUND,
        // backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,

    },
    statsTitle:{
        fontSize: 14,
        color: COLORS.SUBFOREGROUND,
        fontFamily: FONT,
        // textAlign: 'right',
        // marginLeft: 10,
        // marginTop: 10,
        // marginHorizontal: 5,]
        marginLeft: 15,
        marginTop: 5,
        marginBottom: -5,
    },
    
    statsText:{
        fontSize: 14,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        // marginLeft: 10,
        marginHorizontal: 5,
        width: "45%",
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
        fontSize: 22,
        color: COLORS.FOREGROUND,
        width: "100%",
        textAlign: 'center',
        alignContent: 'center',

        fontFamily: FONT,

        marginBottom: 5,
    },
    text: {
        fontSize: 20,
        color: COLORS.FOREGROUND,
    },
    list:{
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
        marginBottom: 10,
    },
    back:{
        position: 'absolute',
        width: 30,
        marginLeft: 10,

        fontSize: 26,
        color: COLORS.FOREGROUND,
        zIndex: 200,
    },
    issMapContainer:{
        flex: 1,
        width: Dimensions.get('window').width,
        // width: "100%",
        aspectRatio: 2.125,
        // margin: 10,
        // borderRadius: 10,
        
        overflow: 'hidden',
        // marginTop: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: 0,
    },
    issMap:{
        width: Dimensions.get('window').width,
        // paddingRight: "2.5%",
        aspectRatio: 2.125,
    },
    subtitle:{
        fontSize: 16,
        fontFamily: FONT,
        color: COLORS.SUBFOREGROUND,
        marginHorizontal: 15,
        marginTop: 10,

    },
    description:{
        fontSize: 16,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        marginHorizontal: 15,
        // marginTop: 10,
        marginBottom: 10,

    },
    streamsContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 10,
        // marginBottom: 10,
    },
    stream:{
        fontSize: 16,
        fontFamily: FONT,
        backgroundColor: COLORS.RED,
        color: COLORS.BACKGROUND,
        borderColor: COLORS.RED,
        borderRadius: 15,
        borderWidth: 2,
        paddingHorizontal: 8,
        paddingTop: 2,
        marginRight: 10,

        // marginHorizontal: 10,
        // marginTop: 10,
        // marginBottom: 10,
    },
    dockTitle:{
        fontSize: 22,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        marginHorizontal: 20,
        marginTop: 15,
    },
    dockName:{
        fontSize: 18,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        marginHorizontal: 12,
        marginTop: 10,
    },
    dockContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
        marginBottom: 5,
        marginHorizontal: 10,
        marginTop: 5,        
        // padding
    },
    dockTime:{
        fontSize: 14,
        fontFamily: FONT,
        color: COLORS.SUBFOREGROUND,
        marginHorizontal: 12,
        marginTop: 5,
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
    
})