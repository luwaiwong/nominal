import { StyleSheet, View, Text, Image, FlatList, StatusBar } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { COLORS, FONT, TOP_BAR_HEIGHT } from '../../../styles';
import Event from '../../../styled/Event';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../data/UserContext';
import LaunchSimple from '../../../styled/LaunchSimple';
import WebView from 'react-native-webview';
import YoutubeIframe from 'react-native-youtube-iframe';
import { TouchableOpacity } from 'react-native-gesture-handler';

export function StarshipDashboard(){
    const userContext = useContext(UserContext);
    const [data, setData] = useState(undefined);


    async function getData(){
        console.log("Getting starship data")
        await userContext.getStarshipData().then((data) => {
            if (data.upcoming == undefined){
                console.log("Data is undefined")
                return;
            }
            setData(data);
        }).catch((error) => {
            console.log("Error getting starship data:", error);
        })
    }


    if (data == undefined) {
        if (userContext != undefined){
            getData();
        }
        return (
            <View style={dstyles.container}>
                <Text style={dstyles.title}>Starship Loading...</Text>
            </View>
        )
    }

    return (
        
        <View style={dstyles.container}>
            <View style={dstyles.infoContainer}>
                <View style={dstyles.streamContainer} >
                    <YoutubeIframe videoId='A8QLrVAOE1k' height={220} play={false} mute={true} />
                </View>
                <TouchableOpacity onPress={() => {}}>
                <View style={dstyles.subInfoContainer}>
                    <Text style={dstyles.sourceText}>Live Starbase Stream: LabPadre</Text>
                </View>

                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}}>
                    <View style={dstyles.sectionHeader}>
                        <Text style={dstyles.sectionTitle}>Starship & Starbase</Text>
                        <View style={dstyles.seeMoreSection}>
                            <Text style={dstyles.seeMoreText}>See More</Text>
                            <MaterialIcons name="arrow-forward-ios" style={dstyles.sectionIcon}/>
                        </View>
                    </View>
                </TouchableOpacity>

                {data != undefined && data.upcoming != undefined && data.upcoming.launches != undefined && data.upcoming.launches[0]!= null && 
                    <View style={dstyles.eventsContainer}>
                        {/* <Text style={dstyles.eventsTitle}>
                            Next Starship Event:
                        </Text> */}
                        <LaunchSimple data={data.upcoming.launches[0]}></LaunchSimple>

                    </View>
                }
            </View>
        </View>
    )

}
export default function StarshipPage(props) {
    const data = props.route.params.data;
    const user = props.route.params.user;
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <MaterialIcons 
                    name="arrow-back-ios" 
                    style={styles.back} 
                    onPress={() => props.navigation.goBack()}>
                </MaterialIcons>
                <Text style={styles.title}>Starship/Starbase</Text>
            </View>
            
        </View>
    )
}
const dstyles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // width: '100%',
        // backgroundColor : COLORS.BACKGROUND_HIGHLIGHT,
        marginHorizontal: 10,
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
    },
    sectionTitle:{
        fontSize: 20,
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
        marginBottom: 2,
        
    },
    infoContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
        // marginTop: 10,
        marginBottom: 10,
        // padding: 10,
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

        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    

    },
    eventsTitle:{
        fontSize: 14,
        color: COLORS.SUBFOREGROUND,
        fontFamily: FONT,
        textAlign: 'center',
        marginBottom: -3,
        marginLeft: 12,
        marginTop: 10,
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
    image: {
        width: "100%",
        aspectRatio: 1,

    }
})