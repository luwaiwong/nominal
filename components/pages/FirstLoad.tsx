import React, { useContext, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, StatusBar, Animated, TouchableOpacity } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { COLORS, FONT, TOP_BAR_HEIGHT } from '../styles';
import Launch from '../styled/Launch';
import PagerView from 'react-native-pager-view';
import { UserContext } from '../data/UserContext';
import { SpaceGrotesk_500Medium, useFonts } from '@expo-google-fonts/space-grotesk';
import Loading from '../styled/Loading';

export default function FirstLoad(props) {
    const opacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            
        ]).start();
    }, []);

    // Fade out on button press and then transition to the next page
    function fadeOut(){
        Animated.timing(opacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start(()=>props.navigation.navigate("Index"));
    }
     // Checks if font is loaded, if the font is not loaded yet, just show a loading screen
    const [fontsLoaded] = useFonts({
        SpaceGrotesk_500Medium,
    });
    if (!fontsLoaded) {
        return <Loading />;
    }
    return (
        <View style={styles.container}>
            {/* <PagerView style={styles.pagerContainer} initialPage={0}> */}
                <Animated.View style={[styles.page,{opacity:opacity}]}>
                    <Text style={styles.title}>Welcome to Nominal</Text>
                    <View>
                        <Text style={styles.text}>View upcoming launches and events, view recently launched missions and be informed on breaking news and articles about space.</Text>

                        <Text style={styles.buffer}></Text>
                        <Text style={styles.text}>get quick access to livestreams,</Text>
                        <Text style={styles.text}>recieve notifications for launches,</Text>

                        <Text style={styles.text}>and use the For You page for an immersive overview of all spaceflight activities.</Text>

                        <Text style={styles.buffer}></Text>




                    </View>
                    <View></View>
                    <View></View>
                    <View>
                        {/* <Text style={styles.text}>Thanks for downloading!</Text> */}
                        <TouchableOpacity onPress={fadeOut}>
                            <Text style={styles.button}>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            {/* </PagerView> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        backgroundColor : COLORS.BACKGROUND,
        // zIndex: 100,
    },
    pagerContainer:{
        flex: 1,
        // backgroundColor: 'white',
        // zIndex: 100,
    },
    page:{
        flex: 1,
        paddingTop: StatusBar.currentHeight,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // backgroundColor: 'white',
    },
    title:{
        fontSize: 30,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,

        width: '100%',
        textAlign: 'center',

        marginTop: 20,
    },
    
    
    
    text: {
        fontSize: 19,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        marginHorizontal: 20,
        marginTop: 2,
        
    },
    buffer:{
        // height: 20,
        marginTop: 15,
    },
    smallertext: {
        fontSize: 16,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        marginHorizontal: 20,
        marginTop: 10,
        
    },
    button:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',

        fontSize: 25,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,

        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 10,
        padding: 10,
        margin: 20,
    },
})