
import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Image, Text, Animated, Linking, TouchableOpacity} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { BACKGROUND_HIGHLIGHT, COLORS, FONT } from "../styles";

export default function ArticleDescriptive(props:{articleData:any}){
    const articleData = props.articleData;
    let hasgif = articleData.image_url != null && articleData.image_url.search(".gif") != -1;

    const today = new Date();
    const articleDateData = new Date(articleData.published_at);
    const timeDiff = today.getTime() - articleDateData.getTime();

    let articleDate = articleDateData.toLocaleString('default', { month: 'long', day: 'numeric', weekday: 'long', year: 'numeric' });
    if (timeDiff <= 1000 * 60 * 60 ){
        const minutes = Math.floor(timeDiff / 60000);
        articleDate = minutes.toString() + " minutes ago";
        console.log(articleDate)
    }
    else if (timeDiff < 1000 * 60 * 60 * 24 * 2){
        const hours = Math.floor(timeDiff / 3600000);
        const text = hours > 1 ? " hours ago" : " hour ago";
        articleDate = hours.toString() + text;
        // articleDate = "Today";
    }
    // If time is more than 72 hours ago, display the date
    else if (timeDiff > 1000 * 60 * 60 * 24 * 2){
        articleDate = articleDateData.toLocaleString('default', { month: 'long', day: 'numeric', weekday: 'long', year: 'numeric' });
    }
    
    return (
        <TouchableOpacity onPress={()=>{Linking.openURL(articleData.url)}}>
            <View style={styles.container}>
                <View style={styles.left}>
                    <View>
                        <Text numberOfLines={3} style={styles.title}>{articleData.title}</Text>
                        <Text numberOfLines={5} style={styles.description}>{articleData.summary}</Text>

                    </View>

                    <Text style={styles.time}>{articleDate}</Text>
                </View>
                <View style={styles.right}>
                    {!hasgif &&  <Image style={[styles.image,{aspectRatio: 1}]} source={{uri: articleData.image_url}} /> }
                           
                    <Text style={styles.source}>{articleData.news_site}</Text>

                </View>
            </View>
            <View style={styles.bottomLine}></View>
        </TouchableOpacity>
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
        paddingBottom: 0,
        // backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
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
        resizeMode: "cover",
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
        marginBottom: 5,
        
        
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
        marginTop: 5,
    },
    time:{

        fontSize: 16,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        marginRight: 2,
        marginTop: 5,
    },
    bottomLine:{
        
        height: 3,
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,

        marginHorizontal: 15,
        marginTop: -3,
        marginBottom: 5,
    }
    
});