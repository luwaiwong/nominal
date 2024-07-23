
import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Image, Text, Animated, Linking, TouchableOpacity, Alert} from "react-native";
import { COLORS, FONT } from "../styles";

export default function Article(props:{articleData:any}){
    const articleData = props.articleData;
    let hasgif = articleData.image_url != null && articleData.image_url.search(".gif") != -1;
    const [aspectRatio, setAspectRatio] = useState(1);

    const today = new Date();
    const articleDateData = new Date(articleData.published_at);
    const timeDiff = today.getTime() - articleDateData.getTime();

    let articleDate = articleDateData.toLocaleString('default', { month: 'long', day: 'numeric', weekday: 'long', year: 'numeric' });
    if (timeDiff < 86400000){
        const hours = Math.floor(timeDiff / 3600000);
        articleDate = hours.toString() + " hours ago";
        // articleDate = "Today";
    }
    // If time is more than 72 hours ago, display the date
    else if (timeDiff < 259200000){
        articleDate = articleDateData.toLocaleString('default', { month: 'long', day: 'numeric', weekday: 'long', year: 'numeric' });
    }
    
    // Get the aspect ratio of the image one time
    // useEffect(() => {
    //     try {
    //         Image.getSize(articleData.image_url, (width, height) => {
    //             let ratio = width/height;
    //             if (ratio < 1.25){
    //                 setAspectRatio(1.25);
    //             }else {
    //                 setAspectRatio(width/height);
    //             }})
                
    //     } catch (error){
    //         console.log("Error getting image size:", error)
    //     }
    // }, []);

    // console.log("Article data:", articleData);
    async function openLink(url: string){
        Linking.openURL(url);
    }

    
    return (
        // <GestureDetector gesture={tap}>
        <TouchableOpacity onPress={()=>openLink(articleData.url)}>
            <View style={[styles.container]}>
                <View style={styles.left}>
                    <Text numberOfLines={4} style={styles.title}>{articleData.title}</Text>

                    <Text style={styles.time}>{articleDate}</Text>
                </View>
                <View style={styles.right}>
                    {!hasgif &&<Image style={[styles.image,{aspectRatio: 1.5}]} source={{uri: articleData.image_url}} />  }      
                    <Text style={styles.source} >{articleData.news_site}</Text>

                </View>
            </View>

        </TouchableOpacity>
        // </GestureDetector>
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
        width: "60%",
    },
    right:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        
        // backgroundColor: COLORS.FOREGROUND,
        width: "40%",

    },
    
    image:{
        width: "100%",
        // resizeMode: "cover",
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
    source:{
        fontSize: 12,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        textAlign: "right",
        marginRight: 2,
    },
    time:{

        fontSize: 12,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        marginRight: 2,
    }
    
});