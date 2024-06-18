
import { useState } from "react";
import { StyleSheet, View, Image, Text} from "react-native";

import { COLORS, FONT } from "../styles";

export default function Article(props:{articleData:any}){
    const articleData = props.articleData;
    
    const [aspectRatio, setAspectRatio] = useState(1);
    Image.getSize(articleData.image_url, (width, height) => {setAspectRatio(width/height);})
    console.log(aspectRatio);
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <Text numberOfLines={4} style={styles.title}>{articleData.title}</Text>
            </View>
            <View style={styles.right}>
                <Image style={[styles.image,{aspectRatio: aspectRatio}]} source={{uri: articleData.image_url}} />        
                <Text style={styles.source}>{articleData.news_site}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        display: "flex",
        flexDirection: "row",

        justifyContent: 'space-between',
        overflow: "hidden",

        margin: 5,
        padding: 5,
        paddingBottom: 3,
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 12,
    },
    left:{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        width: "65%",
    },
    right:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        
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
    source:{
        fontSize: 14,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        textAlign: "right",
        marginRight: 2,
    },
    
});