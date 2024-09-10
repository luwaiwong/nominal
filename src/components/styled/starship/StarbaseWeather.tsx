import { useEffect, useState } from 'react';
import {View, Text, StyleSheet} from 'react-native';

import { WeatherCodes } from "src/utils/WeatherCodes";
import { COLORS, FONT } from '../../../constants/styles';

const apiCall = "https://api.open-meteo.com/v1/forecast?latitude=25.997053&longitude=-97.15528&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto&forecast_days=1"

export default function StarbaseWeather(){
    const [wdata, setWdata] = useState(null);
    const [cdtTime, setCdtTime] = useState(new Date().getTime());

    useEffect(() => {
        fetch(apiCall).then((response) => {
            return response.json();
        }).then((data) => {
            setWdata(data);
        })

        const interval = setInterval(() => {
            let time = new Date().getTime();
            let utcTime = time + new Date().getTimezoneOffset()*60*1000;
            setCdtTime(new Date(utcTime - 5*60*60*1000).getTime());
        }, 1000);
        return () => clearInterval(interval);
    }
    , [])

    if (wdata == null || wdata == undefined){
        return (
            <View style={styles.container}>
                <Text style={styles.time}>Starbase Weather</Text>
                <Text style={styles.weatherText}>Loading...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Local Time & Weather:</Text>
            <Text style={styles.time}>{new Date(cdtTime).toLocaleTimeString()} CDT</Text>
            <View style={styles.weatherContainer}>
                <Text style={styles.weatherText}>{WeatherCodes[wdata.current.weather_code][wdata.current.is_day==1?"day":"night"].description}</Text>
                <Text style={styles.weatherText}>Wind: {wdata.current.wind_speed_10m}{wdata.current_units.wind_speed_10m}</Text>
                <Text style={styles.weatherText}>{wdata.current.temperature_2m}{wdata.current_units.temperature_2m}</Text>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,

        marginHorizontal: 9,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: COLORS.BACKGROUND,


    },
    title:{
        fontSize: 14,
        fontFamily: FONT,
        color: COLORS.SUBFOREGROUND,
        textAlign: 'left',
        width: '100%',
        // marginLeft: 10,
    },
    time:{
        fontSize: 30,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        // textAlign: 'left',
        // width: '100%',
        // marginLeft: 10,

    },
    weatherContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    weatherText: {
        fontSize: 15,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        marginHorizontal: 10,
    },
})