import { View, Text, Image, StyleSheet} from "react-native";

import {COLORS, FONT} from '../styles';

export default function HighlightLaunchInfo(props) {
    const data = props.data;
    const isNext = props.isNext;
    // console.log(data);
    return (
        <View style={styles.container}>
            <Image style={styles.image} blurRadius={10} source={{uri: data.image}} />   
            <View style={styles.infoContainer}>
                <Text style={styles.typeText}>Next Launch</Text>
                <Text style={styles.title}>{data.mission.name}</Text>
                <Text style={styles.rocket}>{data.rocket.configuration.full_name}</Text>
                <Text style={styles.launchProvider}>{data.launch_provider.name}</Text>
                <Text style={styles.launchPad}>{data.launch_pad.name}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
container:{
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    // backgroundColor: COLORS.FOREGROUND,
    width: "100%",
    height: 400,
    padding: 10,

    borderRadius: 10,
    overflow: "hidden"
},
image:{
    position: "absolute",
    top: 0,
    left: 10,

    resizeMode: "cover",

    width: "100%",
    height: "100%",

    borderRadius: 10,

    zIndex: 0,

},
infoContainer:{
    display:"flex",
    flexDirection: "column",
    // backgroundColor: 'rgba(52, 52, 52, 0.6)',
    
    width: "80%",
    borderRadius: 10,

    marginLeft: 10,
    paddingLeft: 5,

    zIndex: 1

},
typeText:{
    fontSize: 16,
    color: COLORS.FOREGROUND,
    fontFamily: FONT,
},
title:{
    fontSize: 26,
    color: COLORS.FOREGROUND,
    fontFamily: FONT,
},
launchProvider:{

    fontSize: 20,
    color: COLORS.FOREGROUND,
    fontFamily: FONT,
},
rocket:{
    fontSize:22,
    color: COLORS.FOREGROUND,
    fontFamily: FONT,
},
launchPad:{
    fontSize:18,
    color:COLORS.FOREGROUND,
    fontFamily:FONT,
}


});