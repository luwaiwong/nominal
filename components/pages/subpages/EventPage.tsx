import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, StatusBar, Image, ScrollView, Pressable, Linking} from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { COLORS, FONT, TOP_BAR_HEIGHT } from '../../styles';
import Launch from '../../styled/Launch';
import TMinus from '../../styled/TMinus';
import LaunchSimple from '../../styled/LaunchSimple';
import { processLaunchData } from '../../data/APIHandler';


const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function EventPage(props) {
    const event = props.route.params.data;
    const time = new Date(event.date);
    const isPrecise = event.date_precision.name === "Hour" || event.date_precision.name === "Minute" || event.date_precision.name === "Day"|| event.date_precision.name === "Second";

    let status = "Upcoming Event";
    let statusColor = COLORS.FOREGROUND;
    // Set Status for Time
    if (time.getTime() < Date.now()) {
        status = "Past Event";
    }
    
    console.log(Object.keys(event))
    const launches = processLaunchData(event.launches);

    // STATE
    const [locDescShown, setLocDescShown] = useState(false);

    // Get the aspect ratio of the image one time
    const [aspectRatio, setAspectRatio] = useState(2);
    useEffect(() => {
        Image.getSize(event.feature_image, (width, height) => {
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
                <Text style={styles.title}>{status}</Text>
            </View>
            <ScrollView>
                {/* Title and date */}
                <View style={styles.headerInfo}>
                    <Text style={styles.launchTitle}>{event.name}</Text>
                    
                    { (isPrecise) ? 
                        <Text style={styles.launchTime}>{DAYS[time.getDay()]+" "+MONTHS[time.getMonth()]+" "+time.getDate()+ ", "+time.getFullYear()}</Text>
                        : 
                        <Text style={styles.launchTime}>{MONTHS[time.getMonth()+1]+" "+time.getFullYear()}</Text>
                        }

                </View>

                {/* Launch Image */}
                <Image style={[styles.image,{aspectRatio: aspectRatio}]} source={{uri: event.feature_image}} />


                {/* TMinus */}
                <View style={styles.tminusContainer}>
                    
                    { (isPrecise) ? 
                        <TMinus time={new Date(time)} />
                        : 
                        <Text style={styles.timeText}> NET {MONTHS[time.getMonth()]+" "+time.getDate()+ ", "+time.getFullYear()}</Text>
                        }
                    
                </View>


                
                {/* Description */}
                <Text style={styles.descriptionTitle}>Description:</Text>
                <Text style={styles.description} >{event.description}</Text>


                {/* Info Section */}
                <Text style={styles.descriptionTitle}>Info:</Text>
                    <Text style={styles.locationText}>{event.location}</Text>
                    <Text style={styles.typeText}>{event.type.name}</Text>

                <View style={styles.launchSection}>
                    <Text style={styles.launchSubtitle}>Related Launches:</Text>
                    {launches.map((launch, index) => {return <LaunchSimple key={index} data={launch} user={props.route.params.user} nav={props.navigation} />})}
                </View>
                

                { event.program.length > 0 &&
                    <View style={styles.section}>
                        <Text style={styles.subtitle}>Programs</Text>
                        {event.program.map((program, index) => {return <Program key={index} data={program} />})}
                    </View>
                }
                { event.agencies.length > 0 &&
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Agencies</Text>
                    {event.agencies.map((agency, index) => {return <Agency key={index} data={agency} />})}
                    
                </View>
                }
                

            </ScrollView>
            
        </View>
    )
}
function Agency(props:{data}){
    // console.log(props.data);

    const data = props.data;
    let country = data.country_code;
    if (data.name == "European Space Agency"){
        country = "EU";
    }

    let type = data.type;
    let name = data.name;
    if (data.name == "National Aeronautics and Space Administration") {
        name = "NASA";
    }
    // console.log(Object.keys(data));
    // console.log(data.name)

    let image = data.nation_url;
    // Pick image
    // launcher specific
    if (data.name == "SpaceX") {
        image = data.image_url
    }
    else if (name == "NASA") {
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
                console.log("Aspect Ratio is less than 1")
                setAspectRatio(1.1)
            } else if (aspectRatio > 1.4) {
                console.log("Aspect Ratio is less than 1")
                setAspectRatio(1.2)
            } else {
                setAspectRatio(width/height);
            }
        })
        
    }, []);

    return (
        <View>
            {/* <View style={styles.agencyTitleContainer}>
                <Text style={styles.agencyText}>{name}</Text>
            </View> */}
            <View style={styles.agencyInfoContainer}>
                <View style={styles.agencyTextSection}>
                <Text style={styles.agencyText}>{name}</Text>
                    <Text style={styles.agencyInfoText}>{data.administrator}</Text>
                    <Text style={styles.agencyInfoText}>Founded: {data.founding_year}</Text>
                    <Text style={styles.agencyInfoText}>Type: {type}, {country}</Text>

                    <View style={styles.seperationLine}></View>
                    {data.spacecraft != "" && <Text style={styles.agencyInfoTextSmall}>Spacecraft: {data.spacecraft}</Text>}
                    {data.launchers != "" && <Text style={styles.agencyInfoTextSmall}>Rockets: {data.launchers}</Text>}
                    {/* <Text style={styles.agencyInfoTextSmall}>Pending Launches: {props.data.pending_launches}</Text> */}
                </View>
                <Image source={{uri: image}} style={[styles.agencyImage, {aspectRatio: aspectRatio}]} />

            </View>

        </View>
    
    )
}

function Program(props:{data}){
    const data = props.data;
    const name = data.name;
    const start = new Date(data.start_date);
    const type = data.type.name;
    const image = data.image_url;
    const description = data.description;
    const info_url = data.info_url;

    let [descriptionShown, setDescriptionShown] = useState(false);

    return (
        <View>
            <Pressable onPress={() => Linking.openURL(info_url)}>   
                <View style={styles.programContainer}>
                    <View style={styles.programInfoContainer}>
                        <Text style={styles.programTitleText}>{name}</Text>
                        <Text style={styles.programText}>Type: {type}</Text>
                        <Text style={styles.programText}>Started: {start.toLocaleDateString()}</Text>
                        {/* <Text style={styles.programText}>Agencies</Text>
                        {data.agencies.map((agency, index) => {
                            let name = agency.name;
                            if (agency.name == "National Aeronautics and Space Administration") {
                                name = "NASA";
                            } else if (agency.name == "Russian Federal Space Agency (ROSCOSMOS)") {
                                name = "Roscosmos";
                            }
                            else if (agency.name == "European Space Agency") {
                                name = "ESA";
                            }
                            else if (agency.name == "Japan Aerospace Exploration Agency") {
                                name = "JAXA";
                            }
                            return <Text style={styles.programText}>{name}</Text>
                        })} */}

                    </View>

                    <Image source={{uri: image}} style={styles.programImage}/>
                </View>
            </Pressable>
            <Pressable onPress={() => setDescriptionShown(!descriptionShown)}>
                <Text style={styles.programDescription} numberOfLines={descriptionShown?10:3}>{description}</Text>  
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
        // borderRadius: 10,
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
        // borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    headerInfo:{
        position: 'absolute',
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba("+COLORS.BACKGROUND_RGB+"0.5)",
        width: "96%",
        borderRadius: 10,
        margin: "2%",
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
        marginBottom: 10,
        width: "100%",

        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
        elevation: 200,
    },
    timeText:{
        fontSize: 30,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'center',


    },

    // #endregion
    // #region DESCRIPTION
    descriptionTitle:{
        fontSize: 13,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'auto',
        marginHorizontal: 12,
        // marginBottom: 5,
        marginTop: 15,

    },
    description:{
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
        marginLeft: 11,
        marginTop: 5,
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
    launchSection:{
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
        margin: 10,
        // padding: 10,
        marginBottom:0

    },
    
    launchSubtitle:{
        fontSize: 15,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        paddingLeft: 13,
        paddingTop: 10,
    },
    //#endregion
    // #region LOCATION DETAILS

    
    locationText:{
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        // marginBottom: 5,
        marginLeft: 12,
    },
    
    typeText:{
        fontSize: 18,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginLeft: 12,
        marginBottom: 10,
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
        width: "45%",
        // height: 200,
        resizeMode: "contain",
        borderRadius: 15,
        marginLeft: "5%",
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
    },
    agencyInfoText:{
        fontSize: 14,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        // width: "50%"
    },
    agencyInfoTextSmall:{
        fontSize: 13,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
    //#endregion

    //#region PROGRAM
    programContainer:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: 5,
    },
    programInfoContainer:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "flex-start",
        alignItems: "flex-start",
        width: "55%",
        height: "100%",
        // padding: 10,
    },
    programImage:{
        width: "40%",
        aspectRatio: 1,
        resizeMode: "contain",
        borderRadius: 15,
        marginLeft: "5%",
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
    },
    programTitleText:{
        fontSize: 21,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
    programText:{
        fontSize: 16,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
    },
    programDescription:{
        fontSize: 16,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginTop: 5,
        marginBottom: 5,
    },
    //#endregion
    
})