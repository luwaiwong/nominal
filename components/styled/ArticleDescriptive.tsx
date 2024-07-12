
import { useState, useRef } from "react";
import { StyleSheet, View, Image, Text, Animated, Linking} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { COLORS, FONT } from "../styles";

export default function ArticleDescriptive(props:{articleData:any}){
    const articleData = props.articleData;
    
    const [aspectRatio, setAspectRatio] = useState(1);

    const today = new Date();
    const articleDateData = new Date(articleData.published_at);
    const timeDiff = today.getTime() - articleDateData.getTime();

    let articleDate = articleDateData.toUTCString().slice(0, -7);
    if (timeDiff < 86400000){
        // const hours = Math.floor(timeDiff / 360000);
        // articleDate = hours.toString() + " hours ago";
        articleDate = "Today";
    }
    else if (timeDiff < 172800000){
        articleDate = "Yesterday";
    }
    
    Image.getSize(articleData.image_url, (width, height) => {setAspectRatio(width/height);})


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
        if (open) Linking.openURL(articleData.url);
        Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true, // Add this to improve performance
        }).start();
    };


    // Gestures
    const tap = Gesture.Tap();

    tap.onTouchesDown(()=>animateIn());
    tap.onEnd(()=>animateOut(true));
    // tap.onTouchesMove(()=>animateIn());
    tap.onTouchesCancelled(()=>animateOut(false));
    // tap.onEnd(()=>toggle()); // UNCOMMENT TO RESTORE PINNED
    tap.numberOfTaps(1);

    
    return (
        <GestureDetector gesture={tap}>
            <Animated.View style={[styles.container,{transform:[{scale}]}]}>
                <View style={styles.left}>
                    <View>
                        <Text numberOfLines={4} style={styles.title}>{articleData.title}</Text>
                        <Text numberOfLines={4} style={styles.description}>{articleData.summary}</Text>

                    </View>

                    <Text style={styles.time}>{articleDate}</Text>
                </View>
                <View style={styles.right}>
                    <Image style={[styles.image,{aspectRatio: aspectRatio}]} source={{uri: articleData.image_url}} />        
                    <Text style={styles.source}>{articleData.news_site}</Text>

                </View>
            </Animated.View>
        </GestureDetector>
    );
}


const styles = StyleSheet.create({
    container:{
        display: "flex",
        flexDirection: "row",

        justifyContent: 'space-between',
        overflow: "hidden",

        margin: 10,
        marginTop: 0,
        padding: 5,
        paddingBottom: 3,
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 12,
    },
    left:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "65%",
    },
    right:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        
        // backgroundColor: COLORS.FOREGROUND,
        width: "35%",

    },
    
    image:{
        width: "100%",
        resizeMode: "contain",
        aspectRatio: 1,
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
    description:{
        fontSize: 13,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        paddingRight: 10,
        
        
    },
    source:{
        fontSize: 16,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        textAlign: "right",
        marginRight: 2,
    },
    time:{

        fontSize: 16,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        marginRight: 2,
    }
    
});