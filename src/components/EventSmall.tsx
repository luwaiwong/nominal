
import { useState, useRef, useContext } from "react";
import { StyleSheet, View, Image, Text, Animated, Linking, TouchableOpacity} from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { COLORS, FONT, TIME_OPTIONS } from "src/styles";
import { useUserStore } from "src/utils/UserStore";

export default function EventSmall(props){
    const nav = useUserStore(state=>state.nav)
    const eventData = props.data;

    if (eventData == undefined) return null;

    const [aspectRatio, setAspectRatio] = useState(1.2);
    const isPrecise = eventData.date_precision != null && (eventData.date_precision.name === "Hour" || eventData.date_precision.name === "Minute" || eventData.date_precision.name === "Day"|| eventData.date_precision.name === "Second");


    // Image.getSize(eventData.feature_image, (width, height) => {setAspectRatio(width/height);})

    let url = eventData.url;

    if (eventData.news_url != null){
        url = eventData.news_url;
    }
    else if (eventData.video_url != null && eventData.webcast_live) {
        url = eventData.video_url;
    }
    else if (eventData.info_urls[0] != null){
        url = eventData.info_urls[0];
    }

    // ANIMATIONS
    const scale = useRef(new Animated.Value(1)).current;
    // Create an animation that scales the view to 1.2 times its original size when pressed
    const animateIn = () => {
        Animated.timing(scale, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true, // Add this to improve performance
        }).start();
    };

    // Create an animation that scales the view back to its original size when released
    const animateOut = (open: boolean) => {
        if (open){
            nav.navigate("Event", {data: eventData});
        }
        Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true, // Add this to improve performance
        }).start();
    };



    return (
        <TouchableOpacity onPress={()=>{ nav.navigate("Event", {data: eventData})}}>
            <Animated.View style={[styles.container, {transform:[{scale}]}]}>
                <View style={styles.left}>
                    <Text numberOfLines={4} style={styles.title}>{eventData.name}</Text>
                    {eventData.type.name != null && <Text style={styles.sourceLeft}>{eventData.location}</Text>}
                    <Text style={styles.sourceLeft} numberOfLines={1}>{eventData.type.name}</Text>
                    {/* Show time and date */}
                    {
                        isPrecise?
                        <Text style={styles.sourceRight}>{new Date(eventData.date).toLocaleString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            weekday: 'short',
                        })}</Text> :
                        <Text style={styles.sourceRight}>NET {new Date(eventData.date).toLocaleString([], {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}</Text>
                    }
                </View>
                <View style={styles.right}>
                    <Image style={[styles.image,{aspectRatio: aspectRatio}]} source={{uri: eventData.feature_image}} />        
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        display: "flex",
        flexDirection: "row",

        justifyContent: 'space-between',
        overflow: "hidden",

        height: 130,
        // padding: 5,
        paddingBottom: 3,
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 12,
        margin: 10,
        marginBottom: 0,
    },
    left:{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: 5,
        flex: 2,
    },
    right:{
        flex: 1,
        width: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        
        // backgroundColor: COLORS.FOREGROUND,
        // width: "100%",

    },
    horizontalContainer:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
    },
    image:{
        width: 140,
        height: 120,
        resizeMode: "cover",
        // aspectRatio: 1,
        borderRadius: 10,
        // backgroundColor: COLORS.BACKGROUND,
    },
    infoContainer:{
        display:"flex",
        flexDirection: "column",
        width: "80%",
        borderRadius: 10,
        marginLeft: 10,
        paddingLeft: 5,
    },
    title:{
        fontSize: 18,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        paddingRight: 10,
        
        
    },
    sourceLeft:{
        fontSize: 14,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        textAlign: "left",
        marginRight: 2,
        flex: 1,
    },
    sourceRight:{
        fontSize: 13,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        textAlign: "right",
        marginRight: 2,
        flex: 1,
    },
    
});