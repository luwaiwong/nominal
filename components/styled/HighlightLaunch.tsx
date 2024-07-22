import { View, Text, Image, StyleSheet, Dimensions, Pressable, TouchableOpacity} from "react-native";
import { BlurView } from "expo-blur";

import {COLORS, FONT} from '../styles';
import TMinus from "./TMinus";
import { useContext } from "react";
import { UserContext } from "../data/UserContext";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function LaunchHighlight(props) {
    const userContext = useContext(UserContext);
    const data = props.data;
    const isNext = props.isNext;
    const launchTime = new Date(data.net);
    let status = "Next Launch";
    if (launchTime.getTime() < Date.now()) {
        status = "Just Launched";
    }
    return (
        <TouchableOpacity onPress={()=>userContext.nav.navigate("Launch", {data: data})}>
            <View style={styles.container}>
                <Image style={styles.image}  source={{uri: data.image}} />   
                <View style={styles.overlay} />
                <View style={styles.infoContainer}>
                    <View style={styles.topSection}>
                        <Text style={styles.typeText}>{status}</Text>
                        <Text style={styles.title}>{data.mission.name}</Text>
                        <Text style={styles.rocket}>{data.rocket.configuration.full_name}</Text>
                        <Text style={styles.launchProvider}>{data.launch_provider.name}</Text>
                        <Text style={styles.launchPad} numberOfLines={1}>{data.launch_pad.location.name}</Text>
                    </View>
                    <BlurView intensity={0} tint='dark' experimentalBlurMethod='dimezisBlurView' style={styles.bottomSection}>
                        <Text style={styles.dateText} >{launchTime.toLocaleString([], {year: 'numeric', month: 'long', weekday: 'short', day: 'numeric', minute: 'numeric', hour: 'numeric'})}</Text>
                        <TMinus time={launchTime} />
            

                    </BlurView>
                </View>
            </View>
            
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
container:{
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    
    width: Dimensions.get('window').width - 20,
    height: 300,
    // padding: 10,
    margin: 10,
    marginTop: 0,

    borderRadius: 10,
    overflow: "hidden",

    elevation: 2,

},
overlay:{
    position: "absolute",
    top: 0,
    left: 0,

    width: "100%",
    height: "100%",

    // backgroundColor: 'rgba(0, 0, 0, 0)',

    borderRadius: 10,

    zIndex: 2,

},
image:{
    position: "absolute",
    top: 0,
    left: 0,

    resizeMode: "cover",

    width: "100%",
    height: "100%",

    borderRadius: 10,

    zIndex: 0,

},
infoContainer:{
    display:"flex",
    flexDirection: "column",

    justifyContent: "space-between",
    
    width: "100%",
    height: "100%",
    borderRadius: 10,

    overflow: "hidden",
    

    // marginLeft: 10,
    padding: 0,

    zIndex: 3

},
topSection:{
    padding: 10,
    height: 160,
},
bottomSection:{
    backgroundColor: 'rgba('+COLORS.BACKGROUND_RGB+ '0.8)',
    margin: 10,
    padding: 5,
    borderRadius: 8,
    overflow: "hidden",
},
typeText:{
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',

    width: 300,
    borderRadius: 5,
    fontSize: 16,

    color: COLORS.FOREGROUND,
    fontFamily: FONT,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 1,
    elevation: 200,
},
title:{
    fontSize: 26,
    color: COLORS.FOREGROUND,
    fontFamily: FONT,
    
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 1,
    elevation: 200,
},
rocket:{
    fontSize:22,
    color: COLORS.FOREGROUND,
    fontFamily: FONT,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 1,
    elevation: 200,
},
launchProvider:{

    fontSize: 15,
    color: COLORS.FOREGROUND,
    fontFamily: FONT,
    
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 1,
    elevation: 200,
},
launchPad:{
    fontSize:15,
    color:COLORS.FOREGROUND,
    fontFamily:FONT,
    
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 0, height: 1.5},
    textShadowRadius: 1,
    elevation: 200,
    // marginLeft: 4
},
dateText:{
    fontSize:18,
    color:COLORS.FOREGROUND,
    fontFamily:FONT,
    
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 0, height: 1.5},
    textShadowRadius: 1,
    elevation: 200,
    marginLeft: 5,
    marginBottom: 5,
}


});