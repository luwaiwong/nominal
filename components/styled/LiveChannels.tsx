import { StyleSheet, Text, View, TouchableOpacity, Linking, Image} from "react-native";
import {parse} from "node-html-parser";
import { useContext, useEffect, useRef, useState } from "react";
import { COLORS, FONT } from "../styles";

var channelid = "UCpQaPYTVlhd7eNR_3agr85Q"; // REPLACE WITH YOUR CHANNEL ID
var NASASpaceFlight = "UCSUu1lih2RifWkKtDOJdsBA"; // REPLACE WITH YOUR CHANNEL ID
var SpaceFlightNow = "UCoLdERT4-TJ82PJOHSrsZLQ"; // REPLACE WITH YOUR CHANNEL ID
var NASA = "UCLA_DiR1FfKNvjuUpBHmylQ"
var live = "https://www.youtube.com/channel/UCSUu1lih2RifWkKtDOJdsBA"
export default function LiveChannels() {

    const [curLives, setLives] = useState([]);
    const lives = useRef(curLives);


    /* REST OF THE CODE */
    async function fetchLiveChannel(id, channel){
        try {
        const response = await fetch(`https://youtube.com/channel/${id}/live`)
        const text = await response.text()
        const html = parse(text)
        const canonicalURLTag = html.querySelector('link[rel=canonical]')
        
        if (canonicalURLTag == null){
            console.log("Error, Youtube blocked URL")
            return;
        }

        const canonicalURL = canonicalURLTag.getAttribute('href')
        const isStreaming = canonicalURL.includes('/watch?v=')
        if (isStreaming){
            // Fetch data from the live stream
            const response = await fetch(canonicalURL)
            const text = await response.text()
            const html = parse(text)
            // Pull the title of the live stream
            const titleTag = html.querySelector('meta[property="og:title"]')
            const title = titleTag.getAttribute('content')

            // Pull the thumbnail of the live stream
            const thumbnailTag = html.querySelector('meta[property="og:image"]')
            const thumbnail = thumbnailTag.getAttribute('content')


            const live = {
                title: title,
                url: canonicalURL,
                channel: channel,
                thumbnail: thumbnail
            }
            
            // Check if the live stream is already in the list
            lives.current = [...lives.current , live]

        }
        } catch (error) {
            // console.log("Error fetching live stream", error)
        }
    }
    async function getLiveStreams(){

        lives.current = []
        await fetchLiveChannel(NASASpaceFlight, "NASASpaceFlight");
        await fetchLiveChannel(SpaceFlightNow, "SpaceFlightNow");
        await fetchLiveChannel(NASA, "NASA");
        setLives(lives.current)
    }
    
    useEffect(()=>{
        console.log("Fetching live streams")
        getLiveStreams()
    }, [])

    if (curLives.length == 0){
        return <View></View>
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Current Livestreams:</Text>
            {
                curLives.map((live, index) => {
                    return (
                        liveChannel(index, live)
                    )
                })
            }
        </View>
    );

}

function liveChannel(index, live){
    return (
        <TouchableOpacity key={index} onPress={()=>{Linking.openURL(live.url)}}>
        <View style={styles.liveContainer} key={index}>
            <Image source={{uri: live.thumbnail}} style={styles.liveImage}/>
            <View style={styles.liveInfo}>
                <Text style={styles.livetitle} numberOfLines={4}>{live.title}</Text>
                <Text style={styles.liveChannel}>{live.channel}</Text>
            </View>
        </View>
        </TouchableOpacity>)
}
const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginHorizontal: 10,
        paddingBottom: 5,

        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
    },
    title:{
        fontSize: 19,
        fontFamily: FONT,

        color: COLORS.FOREGROUND,
        // marginBottom: 10,
        marginLeft: 15,
        marginTop: 5,
    },
    liveContainer:{
        display: 'flex',
        flexDirection: 'row',
        padding: 5,
        marginHorizontal: 10,

        borderRadius: 10,
        // borderWidth: 3,
        borderColor: COLORS.RED,
        

        marginBottom: 5,
    },
    liveImage:{
        width: 160,
        height: 90,
        borderRadius: 10,
        marginTop: 5,
    },
    liveInfo:{
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 10,

        // width: '50%',
        flex: 1,
    },
    livetitle:{
        fontSize: 15,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
    },
    liveChannel:{
        fontSize: 12,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
    }
    
});