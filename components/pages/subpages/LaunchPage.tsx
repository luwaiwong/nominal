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
    let status = "Upcoming";

    // Set Status
    if (launchTime.getTime() < Date.now()) {
        status = "Launched";
    }
    

    // Get the aspect ratio of the image one time
    const [aspectRatio, setAspectRatio] = useState(2);
    useEffect(() => {
        Image.getSize(launch.image, (width, height) => {
        const aspectRatio = width/height;
        if (aspectRatio < 0.9) {
            console.log("Aspect Ratio is less than 1")
            setAspectRatio(1)
        } else {
            setAspectRatio(width/height);}
        })
    }, []);
    

    // console.log(launch.net_precision.name);

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
                <Text style={styles.launchTitle}>{launch.mission.name}</Text>
                
                    { (isPrecise) ? 
                        <Text style={styles.launchTime}>{DAYS[launchTime.getDay()]+" "+MONTHS[launchTime.getMonth()]+" "+launchTime.getDate()+ ", "+launchTime.getFullYear()}</Text>
                        : 
                        <Text style={styles.launchTime}>{MONTHS[launchTime.getMonth()+1]+" "+launchTime.getFullYear()}</Text>
                        }

                {/* Status, Image and TMinus */}
                <View style={styles.statusBannerContainer}>
                    <Text style={styles.statusBannerText}>{status}</Text>
                </View>
                <Image style={[styles.image,{aspectRatio: aspectRatio}]} source={{uri: launch.image}} />
                <View style={styles.tminusContainer}>
                    
                    { (isPrecise) ? 
                        <TMinus time={new Date(launchTime)} />
                        : 
                        <Text style={styles.timeText}> NET {MONTHS[launchTime.getMonth()]+" "+launchTime.getDate()+ ", "+launchTime.getFullYear()}</Text>
                        }
                    
                </View>

                {/* Description */}
                <Text style={styles.test}>webcast: {launch.webcast_live.toString()} vid_urls: {launch.mission.vid_urls}</Text>
                <Text style={styles.launchDescription} >{launch.mission.description}</Text>

                <View style={styles.tagsSection}>
                    <Text style={styles.tag}>{launch.mission.type}</Text>
                    {launch.mission.agencies.map((agency, index) => {
                        return <Text style={styles.tag} key={index}>{agency.type}</Text>
                    })}
                </View>

                {/* Other info */}
                <View style={styles.providerSection}>
                    <Text style={styles.launchProviderTitle}>Launch Provider</Text>
                    <Text style={styles.rocketText}>{launch.rocket.configuration.full_name}</Text>
                    <Text style={styles.launchProviderText}>{launch.launch_provider.name}</Text>
                </View>
                    
                {/* Location Info */}
                <View style={styles.locationSection}>
                    <Text style={styles.launchProviderTitle}>Location</Text>
                    
                    <Text style={styles.launchLocationText}>{launch.launch_pad.location.name}</Text>
                    <View style={styles.launchpadSection}>
                        {launch.launch_pad.name != 'Unknown Pad' &&
                        <Pressable onPress={()=>Linking.openURL(launch.launch_pad.wiki_url)} style={styles.launchpadInfoSection}>
                            <Text style={styles.launchPadText}>{launch.launch_pad.name}</Text>
                            <Text style={styles.padInfoText}>Launch Attempts: {launch.launch_pad.orbital_launch_attempt_count}</Text>
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
                    {launch.launch_pad.description != null && <Text style={styles.locationDescription} numberOfLines={3}>{launch.launch_pad.description}</Text>}
                    
                    <Text style={styles.orbitText}>Target Orbit: {launch.mission.orbit.name}</Text>

                </View>


            </ScrollView>
            
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

        marginHorizontal: 8,
        marginTop: 0,
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
        marginHorizontal: 8,
        // borderRadius: 10,
        // borderBottomLeftRadius: 0,
        // borderBottomRightRadius: 0,
    },
    launchTitle:{
        fontSize: 30,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginHorizontal: 10,
        marginTop: 10,
    },
    launchTime:{
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginHorizontal: 10,
        // marginTop: 5,
        marginBottom: 10,
        width: "100%",
    },
    statusBannerContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        margin: 10,
        marginBottom: 0,
        padding: 10,
    },
    statusBannerText:{
        fontSize: 23,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'center',
        marginHorizontal: 10,
        // marginTop: 5,
        width: "100%",
    },
    timeText:{
        fontSize: 30,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'center',


    },

    // #endregion
    // #region LAUNCH DESCRIPTION
    launchDescription:{
        fontSize: 16,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'auto',
        marginHorizontal: 10,
        marginBottom: 30,
        marginTop: 15,
    },
    
    tagsSection:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        width: "100%",
        marginLeft: 10,
    },
    tag:{
      fontSize: 17,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      fontWeight: "400",
      textAlign: "left",
      backgroundColor: COLORS.ACCENT,
      borderRadius: 10,

      marginRight: 5,
      paddingHorizontal: 5,
      paddingBottom: 2,
    },
    // #endregion

    // #region LAUNCH PROVIDER DETAILS
    providerSection:{
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
    launchProviderTitle:{
        fontSize: 15,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
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
    // #region LAUNCH LOCATION DETAILS
    locationSection:{
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
        marginHorizontal: 10,
        padding: 10,
    },

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
        marginBottom: 10,
    },
    locationDescription:{
        fontSize: 15,
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
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginTop: 5,
    },
    seperationLine:
    {
        
        width: "80%",
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        marginVertical: 5,
    }
    
})