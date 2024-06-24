import { View, Text, Image, StyleSheet, Dimensions} from "react-native";
import { BlurView } from "expo-blur";

import {COLORS, FONT} from '../styles';

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function HighlightLaunch(props) {
    const data = props.data;
    const isNext = props.isNext;
    const launchTime = new Date(data.net);
    // console.log(data);
    return (
        <View style={styles.container}>
            <Image style={styles.image} blurRadius={1} source={{uri: data.image}} />   
            <View style={styles.overlay} />
            <View style={styles.infoContainer}>
                <View style={styles.topSection}>
                    <Text style={styles.typeText}>Next Launch</Text>
                    <Text style={styles.title}>{data.mission.name}</Text>
                    <Text style={styles.rocket}>{data.rocket.configuration.full_name}</Text>
                    <Text style={styles.launchProvider}>{data.launch_provider.name}</Text>
                </View>
                <View style={styles.bottomSection}>
                    <Text style={styles.launchPad}>{data.launch_pad.name}</Text>
                    <Text style={styles.launchPad}>{DAYS[launchTime.getDay()]+" "+MONTHS[launchTime.getMonth()]+" "+launchTime.getDate()+ ", "+launchTime.getFullYear()}</Text>
          

                </View>
            </View>
        </View>
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

    borderRadius: 10,
    overflow: "hidden",

},
overlay:{
    position: "absolute",
    top: 0,
    left: 0,

    width: "100%",
    height: "100%",

    backgroundColor: 'rgba(0, 0, 0, 0.15)',

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
    padding: 10,

    zIndex: 3

},
topSection:{

},
bottomSection:{

},
typeText:{
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',

    width: 110,
    borderRadius: 5,
    fontSize: 16,

    color: COLORS.FOREGROUND,
    fontFamily: FONT,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    elevation: 200,
},
title:{
    fontSize: 26,
    color: COLORS.FOREGROUND,
    fontFamily: FONT,
    
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    elevation: 200,
},
launchProvider:{

    fontSize: 20,
    color: COLORS.FOREGROUND,
    fontFamily: FONT,
    
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    elevation: 200,
},
rocket:{
    fontSize:22,
    color: COLORS.FOREGROUND,
    fontFamily: FONT,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    elevation: 200,
},
launchPad:{
    fontSize:18,
    color:COLORS.FOREGROUND,
    fontFamily:FONT,
    
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    elevation: 200,
}


});