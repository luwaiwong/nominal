import { StyleSheet, View, Text, Image, FlatList, StatusBar, Dimensions } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { COLORS, FONT, TOP_BAR_HEIGHT } from '../../../styles';
import Event from '../../../styled/Event';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../data/UserContext';
import LaunchSimple from '../../../styled/LaunchSimple';
import { WebView } from 'react-native-webview';
import { TouchableOpacity } from 'react-native-gesture-handler';

const streamID = "P9C25Un7xaM"
export function ISSDashboard(){
    const userContext = useContext(UserContext);
    const [data, setData] = useState(undefined);
    const [mapLoaded, setMapLoaded] = useState(false);
    let launches = undefined;
    let events = undefined;
    let related = undefined;

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
        console.log("Getting ISS data")
        await userContext.getISSData().then((data) => {
            data.related = getISSrelated();
            setData(data);
        }).catch((error) => {
            console.log("Error getting ISS data:", error);
        })
    }

    // Check if need to get iss data
    if (data == undefined) {
        if (userContext != undefined){
            getData();
        }
        return (
            <View style={dstyles.container}>
                <Text style={dstyles.title}>ISS Loading...</Text>
            </View>
        )
    }
    
    return (
        <View style={dstyles.container}>
                <View style={dstyles.infoContainer}>
                        <View style={dstyles.issMapContainer} pointerEvents='none'>
                            <WebView source={{uri: 'http://wsn.spaceflight.esa.int/iss/index_portal.php'}} style={dstyles.issMap} scrollEnabled={false} cacheEnabled={true} cacheMode='LOAD_CACHE_ELSE_NETWORK'/>
                        </View>
                    
                    <TouchableOpacity onPress={() => {}}>
                        {/* <Text style={dstyles.sourceText}>Live Source: ESA</Text>   */}
        
                        <View style={dstyles.subInfoContainer}>
                            <Text style={dstyles.sourceText}>Live ISS Position: ESA</Text>
                        </View>
                        
                    <TouchableOpacity onPress={() => {}}>
                        <View style={dstyles.sectionHeader}>
                            <Text style={dstyles.sectionTitle}>International Space Station</Text>
                            <View style={dstyles.seeMoreSection}>
                                <Text style={dstyles.seeMoreText}>See More</Text>
                                <MaterialIcons name="arrow-forward-ios" style={dstyles.sectionIcon}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    </TouchableOpacity>
                    {data.related != undefined && 
                    <View style={dstyles.relatedSection}> 
                        <Text style={dstyles.subtitle}>Next ISS Event:</Text>
                        {data.related.type == "event" ? 
                            <Event  eventData={data.related}/>:
                            <LaunchSimple  data={data.related}/>
                            
                        }
                    </View>}
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
                <Text style={styles.title}>Events</Text>
            </View>
            
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
        marginBottom: 10,
        marginTop: 15,
        // paddingTop: 10,

        // padding: 10
        
        // zIndex: 100,shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
    },
    title:{
        fontSize: 26,
        color: COLORS.FOREGROUND,
        width: "100%",

        fontFamily: FONT,

        // marginBottom: 15,
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
        paddingHorizontal: 10,
        // marginHorizontal: 10,
        // marginBottom: 5,
    },
    sectionTitle:{
        fontSize: 18,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        // marginBottom: 1,
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
        // marginRight: 10,
        // marginBottom: 2,
    },
    seeMoreSection:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        marginBottom: 1,
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
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginLeft: 13,
        marginTop: 10,
    },
    subInfoContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'flex-end',
        justifyContent: 'flex-start',
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
        marginHorizontal: 5,
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
        borderRadius: 10,
        // borderTopLeftRadius: 0,
        // borderTopRightRadius: 0,
        // marginTop: 10,
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
    
})