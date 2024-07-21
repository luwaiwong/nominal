import { StyleSheet, View, Text, Image, FlatList, StatusBar } from 'react-native';
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
    const launches = userContext.launches;
    const events = userContext.events;
    let relatedCount = 0;

    function getISSrelated(){
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
                        console.log(programs[i].name);
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

        relatedCount = e.length;
        // Check if precise
        if (result[0] != undefined){
            if (result[0].type == "event" && result[0].date_precision != null && result[0].date_precision == "Month"){
                return result[0];
            }
            else if (result[0].type == "launch" && result[0].net_precision != null && result[0].net_precision == "Month"){
                return result[0];
            }
        }
        return []
    }
    
    const related = getISSrelated();

    getISSrelated();
    
    return (
        <View style={dstyles.container}>
            <TouchableOpacity onPress={() => {}}>
                <View style={dstyles.sectionHeader}>
                    <Text style={dstyles.sectionTitle}>ISS Status</Text>
                    <View style={dstyles.seeMoreSection}>
                        <Text style={dstyles.seeMoreText}>See More</Text>
                        <MaterialIcons name="arrow-forward-ios" style={dstyles.sectionIcon}/>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={dstyles.infoContainer}>
                <View style={dstyles.issMapContainer} pointerEvents='none'>
                    <WebView source={{uri: 'http://wsn.spaceflight.esa.int/iss/index_portal.php'}} style={dstyles.issMap} scrollEnabled={false}/>
                </View>
                <View style={dstyles.subInfoContainer}>
                    <Text style={dstyles.sourceText}>Live ISS Position</Text>
                    <Text style={dstyles.sourceText}>Source: ESA</Text>
                </View>
            </View>
            {related != undefined && related.length != 0 && 
            <View style={dstyles.relatedSection}> 
                {related.map((item, index) => {
                    if (item.type == "event"){
                        return <Event key={index} data={item}/>
                    }
                    if (item.type == "launch"){
                        return <LaunchSimple key={index} data={item}/>
                    }
                })}
            </View>}
        </View>
    )

}
export default function StarshipPage(props) {
    const data = props.route.params.data;
    const user = props.route.params.user;
    // console.log(data.length);
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
        // backgroundColor : COLORS.BACKGROUND_HIGHLIGHT,
        marginHorizontal: 10,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
        // paddingTop: 10,

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
        paddingHorizontal: 3,
        // marginHorizontal: 10,
        // marginBottom: 5,
    },
    sectionTitle:{
        fontSize: 26,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        // marginBottom: 10,
        // marginLeft: 10,
        marginTop: 5,
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
        marginTop: 10,
        marginBottom: 10,
        // padding: 10,
    },
    
    issMapContainer:{
        flex: 1,
        // width: "100%",
        // margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        // marginTop: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    issMap:{
        width: "100%",
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
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 3,
        marginBottom: 5,
    },
    sourceText:{
        fontSize: 16,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'right',
        marginTop: 5,
        marginHorizontal: 5,
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
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
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