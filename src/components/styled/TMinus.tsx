import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, FONT } from '../../constants/styles';

export default function TMinus(props:{time}){
    const time = props.time;

    let currentTime = new Date();
    let date = new Date(time);
    let timeDifference = date.getTime() - currentTime.getTime()-1000;
    let days = (Math.floor(timeDifference / (1000 * 60 * 60 * 24)));
    let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    const [tminus, setTminus] = useState(calculateTminus(time));

    useEffect(()=>{
        const interval = setInterval(()=>{
            setTminus(calculateTminus(time));
        }, 1000);
        return ()=>clearInterval(interval);
    },[]);

    return (
        <View style={styles.container}>
            <View style={styles.timeContainer}>
                <View style={styles.tSection}>
                    <Text style={styles.text}>T</Text>
                </View>
                <View style={styles.textSpacer}>
                    {tminus[4] < 0 && <Text style={styles.textPlus}>+</Text>}
                    {tminus[4] >= 0 && <Text style={styles.text}>-</Text>}
                </View>
                <View style={styles.textSection}>
                    <Text style={styles.timeText}>{formatNumber(tminus[0])}</Text>
                </View>
                <View style={styles.textSpacer}>
                    <Text style={styles.text}>:</Text>
                </View>
                <View style={styles.textSection}>
                    <Text style={styles.timeText}>{formatNumber(tminus[1])}</Text>
                </View>
                <View style={styles.textSpacer}>
                    <Text style={styles.text}>:</Text>
                </View>
                <View style={styles.textSection}>
                    <Text style={styles.timeText}>{formatNumber(tminus[2])}</Text>
                </View>
                <View style={styles.textSpacer}>
                    <Text style={styles.text}>:</Text>
                </View>
                <View style={styles.textSection}>
                    <Text style={styles.timeText}>{formatNumber(tminus[3])}</Text>
                </View>
            </View>
            <View style={styles.subTextSection}>
                <View style={styles.tSection}>
                    <Text style={styles.subText}></Text>
                </View>
                <View style={styles.textSpacer}>
                </View>
                <View style={styles.textSection}>
                    <Text style={styles.subText}>days</Text>
                </View>
                <View style={styles.textSpacer}>
                </View>
                <View style={styles.textSection}>
                    <Text style={styles.subText}>hours</Text>
                </View>
                <View style={styles.textSpacer}>
                </View>
                <View style={styles.textSection}>
                    <Text style={styles.subText}>minutes</Text>
                </View>
                <View style={styles.textSpacer}>
                </View>
                <View style={styles.textSection}>
                    <Text style={styles.subText}>seconds</Text>
                </View>
            </View>
        </View>
    )
}

function calculateTminus(launchTime: Date, status: string = "TBC"){
  let currentTime = new Date();
  let launchDate = new Date(launchTime);
  let timeDifference = launchDate.getTime() - currentTime.getTime();
    let plusorminus = 1
  if (timeDifference < 0){
    timeDifference = currentTime.getTime() - launchDate.getTime();
    plusorminus = -1;
  }
  let days = (Math.floor(timeDifference / (1000 * 60 * 60 * 24)));
  let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);


  return [(days), (hours), (minutes), (seconds), plusorminus];
}


function formatNumber(num: number){
  return ('0'+num.toString()).slice(-2)
}

const styles = StyleSheet.create({
    container:{
        width: "100%",
        height: 65,
        // backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 10,

        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "space-around",
    },
    timeContainer:{
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-around",

    },
    tSection:{
        width: "9%",
        margin: "1%",
        alignContent: "center",
        // backgroundColor: "white",
        borderRadius: 10,
    },
    textSection:{
        width: "16%",
        margin: "1%",
        // backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 10,
    },
    textSpacer:{
        width: "6%",
    },
    text:{
        fontSize: 40,
        color: COLORS.FOREGROUND,
        textAlign: "center",
        fontFamily: FONT,
        

    },
    textPlus:{
        fontSize: 40,
        color: COLORS.FOREGROUND,
        textAlign: "center",
        fontFamily: FONT,
        marginTop: 5,
        

    },
    timeText:{
        fontSize: 40,
        color: COLORS.FOREGROUND,
        textAlign: "center",
        fontFamily: FONT,
        backgroundColor: "rgba("+COLORS.BACKGROUND_RGB+"0.5)",
        borderRadius: 10,
    },
    subTextSection:{
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-around",
    },

    subText:{
        fontSize: 12,
        color: COLORS.FOREGROUND,
        textAlign: "center",
        fontFamily: FONT,
        marginTop: 1,
    }
});