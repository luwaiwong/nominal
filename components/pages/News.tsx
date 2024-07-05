
import { ScrollView, StatusBar, StyleSheet, Text, View, Animated, Pressable} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT } from "../styles";

import Article from "../styled/Article";
import Event from "../styled/Event";

export default function News(props){
    const userData = props.userData;
    const launchData = props.data.launchData;    
    const news = props.data.launchData.newsHighlights;

    const nav = props.data.nav;
    const eventsHighlights = props.data.launchData.eventsHighlights;

    return (<>
        <View style={styles.container}>
            <ScrollView>
                {eventsHighlights != undefined && eventsHighlights.length == 0 && <Text style={styles.sectionTitle}>No Upcoming Events</Text>}
                {eventsHighlights != undefined && eventsHighlights.length != 0 && 
                <View style={styles.sectionContainer}>
                    <Pressable onPress={() => {nav.navigate('All Events', {data:launchData.events})}}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Events</Text>
                            <View style={styles.seeMoreSection}>
                                <Text style={styles.seeMoreText}>See All</Text>
                                <MaterialIcons name="arrow-forward-ios" style={styles.sectionIcon}/>
                            </View>
                        </View>
                    </Pressable>
                    {eventsHighlights != undefined && eventsHighlights.map((item, index) => {return (<Event eventData={item} key={index}/>);})}        
                </View>
                }
                
                <View style={styles.sectionContainer}>
                    <Pressable onPress={() => {nav.navigate('All News', {data:launchData.news})}}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Articles</Text>
                            <View style={styles.seeMoreSection}>
                                <Text style={styles.seeMoreText}>See All</Text>
                                <MaterialIcons name="arrow-forward-ios" style={styles.sectionIcon}/>
                            </View>
                        </View>
                    </Pressable>
                    <View style={{height:10}}></View>
                    {news != undefined && news.map((item, index) => {return (<Article articleData={item} key={index}/>);})}
                </View>
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
        marginBottom: BOTTOM_BAR_HEIGHT,
        width: '100%',
    },
    // SECTION STUFF
    sectionContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',


        backgroundColor: COLORS.BACKGROUND,
        borderRadius: 15,
        width: '100%',
        marginTop: 10,
        
    },
    // SECTION HEADERS
    sectionHeader:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 3,
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
        
    }
    
})