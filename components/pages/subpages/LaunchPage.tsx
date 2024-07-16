import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, StatusBar, Image, ScrollView, Pressable, Linking} from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { COLORS, FONT, TOP_BAR_HEIGHT } from '../../styles';
import Launch from '../../styled/Launch';
import TMinus from '../../styled/TMinus';


const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function LaunchPage(props) {
    const launch = props.route.params.data;
    const launchTime = new Date(launch.net);
    const isPrecise = launch.net_precision.name === "Hour" || launch.net_precision.name === "Minute" || launch.net_precision.name === "Day"|| launch.net_precision.name === "Second";

    let status = "Upcoming Launch";
    let statusColor = COLORS.FOREGROUND;
    // Set Status for Time
    if (launchTime.getTime() < Date.now()) {
        status = "Launched";
    }
    // Check Status for Launch
    if (launch.status.id === 4) {
        status = "Failed Launch";
        statusColor = COLORS.RED;
    }   else if (launch.status.id === 7) {
        status = "Partial Failure";
        statusColor = COLORS.YELLOW;
    }  else if (launch.status.id === 3) {
        status = "Successful Launch";
        statusColor = COLORS.GREEN;
    }
    
    // console.log(Object.keys(launch));
    // console.log(launch.mission)

    // STATE
    const [locDescShown, setLocDescShown] = useState(false);

    // Get the aspect ratio of the image one time
    const [aspectRatio, setAspectRatio] = useState(2);
    useEffect(() => {
        Image.getSize(launch.image, (width, height) => {
        const aspectRatio = width/height;
        if (aspectRatio < 1) {
            console.log("Aspect Ratio is less than 1")
            setAspectRatio(1.1)
        } else if (aspectRatio > 1.4) {
            console.log("Aspect Ratio is less than 1")
            setAspectRatio(1.4)
        } else {
            setAspectRatio(width/height);}
        })
    }, []);
    


    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <MaterialIcons 
                    name="arrow-back-ios" 
                    style={styles.back} 
                    onPress={() => props.navigation.goBack()}>
                </MaterialIcons>
                <Text style={styles.title}>Launch</Text>
            </View>
            <ScrollView>
                {/* Title and date */}
                <View style={styles.headerInfo}>
                    <Text style={styles.launchTitle}>{launch.mission.name}</Text>
                    
                    { (isPrecise) ? 
                        <Text style={styles.launchTime}>{DAYS[launchTime.getDay()]+" "+MONTHS[launchTime.getMonth()]+" "+launchTime.getDate()+ ", "+launchTime.getFullYear()}</Text>
                        : 
                        <Text style={styles.launchTime}>{MONTHS[launchTime.getMonth()+1]+" "+launchTime.getFullYear()}</Text>
                        }

                </View>

                {/* Launch Image */}
                <Image style={[styles.image,{aspectRatio: aspectRatio}]} source={{uri: launch.image}} />

                {/* Status*/}
                <View style={styles.statusBannerContainer}>
                    {/* <Text style={styles.statusBannerText}>Status: </Text> */}
                    <Text style={[styles.statusBannerText,{color: statusColor}]}>{status}</Text>
                </View>

                {/* TMinus */}
                <View style={styles.tminusContainer}>
                    
                    { (isPrecise) ? 
                        <TMinus time={new Date(launchTime)} />
                        : 
                        <Text style={styles.timeText}> NET {MONTHS[launchTime.getMonth()]+" "+launchTime.getDate()+ ", "+launchTime.getFullYear()}</Text>
                        }
                    
                </View>


                {launch.failreason != null && launch.failreason != "" && <Text style={styles.failReason} >Cause of Failure: {launch.failreason}</Text>}
                

                {/* Description */}
                <Text style={styles.descriptionTitle}>Description:</Text>
                <Text style={styles.launchDescription} >{launch.mission.description}</Text>


                <Text style={styles.descriptionTitle}>Tags:</Text>
                <View style={styles.tagsSection}>
                    <Text style={styles.tag}>{launch.mission.type}</Text>
                    {launch.mission.agencies.map((agency, index) => {
                        return <Text style={styles.tag} key={index}>{agency.type}</Text>
                    })}
                    <Text style={styles.tag} >{launch.mission.orbit.name}</Text>
                </View>
                
                {/* Other info */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Rocket</Text>
                    <Text style={styles.rocketText}>{launch.rocket.configuration.full_name}</Text>
                    <Text style={styles.launchProviderText}>{launch.launch_provider.name}</Text>
                </View>
                    
                {/* Location Info */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Location</Text>
                    
                    <Text style={styles.launchLocationText}>{launch.launch_pad.location.name}</Text>
                    <View style={styles.launchpadSection}>
                        {launch.launch_pad.name != 'Unknown Pad' &&
                        <Pressable onPress={()=>Linking.openURL(launch.launch_pad.wiki_url)} style={styles.launchpadInfoSection}>
                            <Text style={styles.launchPadText}>{launch.launch_pad.name}</Text>
                            {/* {launch.launch_pad.total} */}
                            <Text style={styles.padInfoText}>Total Launches: {launch.launch_pad.total_launch_count}</Text>
                            <View style={styles.seperationLine}></View>
                            <Text style={styles.padInfoText}>Latitude: {launch.launch_pad.latitude}</Text>
                            <Text style={styles.padInfoText}>Longitude: {launch.launch_pad.longitude}</Text>
                        </Pressable>
                        }
                        
                        <Pressable onPress={()=>Linking.openURL(launch.launch_pad.map_url)} style={styles.launchpadImageSection}>
                            <Image style={styles.mapImage} source={{uri: launch.launch_pad.map_image}} />
                        </Pressable>

                    </View>
                    
                    {/* Hide if no description */}
                    {launch.launch_pad.description != null && 
                    <Pressable onPress={()=>setLocDescShown(!locDescShown)}>
                        <Text style={styles.locationDescription} numberOfLines={locDescShown?10:2}>{launch.launch_pad.description}</Text>
                    </Pressable>
                    }
                    
                    <Text style={styles.orbitText}>Target: {launch.mission.orbit.name}</Text>

                </View>
                { launch.mission.agencies.length > 0 &&
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Agencies</Text>
                    {launch.mission.agencies.map((agency, index) => {return <Agency key={index} data={agency} />})}
                    
                </View>
                }
                <Text style={styles.test}>webcast: {launch.webcast_live.toString()} vid_urls: {launch.mission.vid_urls}</Text>
                <Text style={styles.test}>holdreason: {launch.holdreason}</Text>


            </ScrollView>
            
        </View>
    )
}

function Agency(props:{data}){
    const data = props.data;
    let country = data.country_code;
    if (data.name == "European Space Agency"){
        country = "EU";
    }

    let type = data.type;
    let name = data.name;
    // if (data.name == "National Aeronautics and Space Administration") {
    //     name = "NASA";
    // }
    // console.log(Object.keys(data));
    // console.log(data.name)

    let image = data.nation_url;
    // Pick image
    // launcher specific
    if (data.name == "SpaceX") {
        image = data.image_url
    }
    else if (name == "National Aeronautics and Space Administration") {
        image = data.logo_url;
    }
    else if (data.nation_url != null) {
        image = data.nation_url;
    }   else if (data.image_url != null) {
        image = data.image_url;
    }   else if (data.logo_url != null) {
        image = data.logo_url;
    }

    // Set aspect ratio
    
    const [aspectRatio, setAspectRatio] = useState(1);
    useEffect(() => {
        Image.getSize(image, (width, height) => {
            const aspectRatio = width/height;
            if (aspectRatio < 1) {
                setAspectRatio(1.1)
            } else if (aspectRatio > 1.4) {
                setAspectRatio(1.2)
            } else {
                setAspectRatio(width/height);
            }
        })
        
    }, []);

    return (
        <View>
            <Pressable onPress={()=>Linking.openURL(data.info_url)}>
                <View style={styles.agencyTitleContainer}>
                    <Text style={styles.agencyText}>{name}</Text>
                </View>
                <View style={styles.agencyInfoContainer}>
                    <View style={styles.agencyTextSection}>
                        <Text style={styles.agencyInfoText}>{data.administrator}</Text>
                        <Text style={styles.agencyInfoText}>Founded: {data.founding_year}</Text>
                        <Text style={styles.agencyInfoText}>Type: {type}, {country}</Text>

                        <View style={styles.seperationLine}></View>
                        {/* {data.spacecraft != "" && <Text style={styles.agencyInfoTextSmall}>Spacecraft: {data.spacecraft}</Text>} */}
                        {data.launchers != "" && <Text style={styles.agencyInfoTextSmall}>Rockets: {data.launchers}</Text>}
                        <Text style={styles.agencyInfoTextSmall}>Current Launch Streak: {data.consecutive_successful_launches}</Text>
                        <Text style={styles.agencyInfoTextSmall}>Total Launches: {data.total_launch_count}</Text>
                        <Text style={styles.agencyInfoTextSmall}>Total Landings: {data.successful_landings}</Text>
                        {/* <Text style={styles.agencyInfoTextSmall}>Pending Launches: {props.data.pending_launches}</Text> */}
                    </View>
                    <Image source={{uri: image}} style={[styles.agencyImage, {aspectRatio: aspectRatio}]} />

                </View>

            </Pressable>
        </View>
    
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        backgroundColor : COLORS.BACKGROUND,
        paddingTop: StatusBar.currentHeight
        // zIndex: 100,
    },
    test:{
        fontSize: 16,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'auto',
        marginLeft: 10,
        marginTop: 5,
    },

    //#region  TITLE & BACK 
    titleContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        // marginTop: StatusBar.currentHeight,
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
    back:{
        position: 'absolute',
        width: 30,
        marginLeft: 10,

        fontSize: 26,
        color: COLORS.FOREGROUND,
        zIndex: 200,
    },
    // #endregion

    // #region HEADER AREA
    tminusContainer:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        // marginHorizontal: 8,
        // marginTop: 0,
        padding: 10,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,

        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
    },
    
    image:{
        // width: "100%",
        resizeMode: "cover",
        aspectRatio: 1,
        // margin: 10,
        // marginHorizontal: 8,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    headerInfo:{
        position: 'absolute',
        top: 0,
        zIndex: 100
    },
    launchTitle:{
        fontSize: 30,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginHorizontal: 10,
        marginTop: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
        elevation: 200,
    },
    launchTime:{
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginHorizontal: 10,
        // marginTop: 5,
        // marginBottom: 10,
        width: "100%",

        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
        elevation: 200,
    },
    statusBannerContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        // borderRadius: 10,
        // borderBottomLeftRadius: 0,
        // borderBottomRightRadius: 0,
        // margin: 10,
        
        marginBottom: -10,
        padding: 10,

        // paddingTop: 5
    },
    statusBannerText:{
        
        fontSize: 23,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'center',
        // marginHorizontal: 10,
        // marginTop: 5,
        width: "100%",
    },
    timeText:{
        fontSize: 30,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'center',


    },
    failReason:{
        fontSize: 15,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'justify',
        marginHorizontal: 10,
        marginTop: 10,
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,

        padding: 10,

        borderRadius: 10,
        borderColor: COLORS.RED,
        borderWidth: 2,
    },

    // #endregion
    // #region LAUNCH DESCRIPTION
    descriptionTitle:{
        fontSize: 13,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'auto',
        marginHorizontal: 12,
        // marginBottom: 5,
        marginTop: 15,

    },
    launchDescription:{
        fontSize: 16,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'auto',
        marginHorizontal: 12,
        marginBottom: 16,
        // marginTop: 15,
    },
    
    tagsSection:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        width: "100%",
        marginLeft: 12,
        // marginTop: 4,
        // marginBottom: 20,
    },
    tag:{
      fontSize: 15,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
      backgroundColor: COLORS.ACCENT,
      borderRadius: 10,

      marginRight: 5,
      paddingHorizontal: 5,
      paddingBottom: 2,
      marginTop: 5,
    },
    // #endregion

    //#region Common styles
    section:{
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
        margin: 10,
        padding: 10,
        marginBottom:0
    },
    
    subtitle:{
        fontSize: 15,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
    //#endregion
    // #LAUNCH PROVIDER DETAILS
    launchProviderText:{
        fontSize: 18,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
    rocketText:{
        fontSize: 22,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },

    // #endregion
    // #region LOCATION DETAILS

    launchpadSection:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        
    },
    launchpadInfoSection:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        // width: "50%",
        flex: 1,
        // backgroundColor: 'white'
        marginRight: 10,
    },
    launchpadImageSection:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "48%",
        flex: 1,
        // backgroundColor: 'white'
    },
    
    
    mapImage:{
        width: "100%",
        aspectRatio: 1.5,
        resizeMode: "cover",
        borderRadius: 10,

    },
    launchLocationText:{
        fontSize: 22,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginBottom: 5,
    },
    launchPadText:{
        fontSize: 14,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginBottom: 15,
    },
    locationDescription:{
        fontSize: 14,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginTop: 5,
    },
    padInfoText:{
        fontSize: 12,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
    orbitText:{
        fontSize: 18,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginTop: 5,
    },
    seperationLine:
    {
        width: "75%",
        height: 1,
        backgroundColor: COLORS.FOREGROUND,
        marginVertical: 5,
    },
    //#region Agencies
    agencyInfoContainer:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        // alignItems: "flex-start",
        width: "100%",
        marginBottom: 10,
    },
    agencyTitleContainer:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
    },
    agencyTextSection:{
        width: "50%",
    },
    agencyText:{
        fontSize: 22,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        // paddingRight: 10,
        width: "100%",
    },
    agencyImage:{
        width: "43%",
        // height: 200,
        resizeMode: "cover",
        borderRadius: 10,
        marginLeft: "5%",
        marginRight: "1%",
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
    },
    agencyInfoText:{
        fontSize: 13,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        // width: "50%"
    },
    agencyInfoTextSmall:{
        fontSize: 11,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },

    


    //#endregion
    
})