import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT } from "../styles";

import Article from "../styled/Article";

export default function News(props){
    const userData = props.userData;
    const news = props.data.launchData.news;

    const eventsHighlights = props.data.launchData.eventsHighlights;

    return (<>
        <View style={styles.container}>
            <ScrollView>
                {eventsHighlights != undefined && eventsHighlights.length == 0 && <Text style={styles.sectionTitle}>No Upcoming Events</Text>}
                {eventsHighlights != undefined && eventsHighlights.length != 0 && 
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Upcoming Events</Text>
                    {eventsHighlights != undefined && eventsHighlights.map((item, index) => {return (<Text style={styles.newsItemTitle} key={index}>{item.name}</Text>);})}        
                </View>
                }
                
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Articles</Text>
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
    sectionContainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',


        backgroundColor: COLORS.BACKGROUND,
        borderRadius: 15,
        width: '100%',
    },
    sectionTitle:{
        fontSize: 24,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: 'left',
        marginBottom: 10,
        marginLeft: 10,
    },
    newsItemContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    newsItemTitle:{
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        height: 50,
    },
    
})