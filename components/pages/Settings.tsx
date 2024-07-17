import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Switch, Dimensions, Pressable, Alert} from 'react-native';
import { BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT } from '../styles';
import { ScrollView } from 'react-native-gesture-handler';

import { UserContext } from '../data/UserContext';

export default function Settings(){
    let userContext = React.useContext(UserContext);
    let settings = userContext.settings;
    const [notifStatus, setNotifStatus] = React.useState(settings.enablenotifs);
    const [showPastLaunches, setShowPastLaunches] = React.useState(settings.fyshowpastlaunches);
    const [showPastEvents, setShowPastEvents] = React.useState(settings.fyshowpastevents);

    function clearCache(){
        Alert.alert("Clear Cache", "Are you sure you want to clear the cache?\bThis will delete all stored data on your device", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Clear",
                style: 'destructive',
                onPress: () => {
                    userContext.clearData();
                }
            }
        ])
    }
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.scrollContainer}>
                        <View>
                            <Text style={styles.title}>Notifications</Text>
                            <Pressable style={styles.buttonContainer} onPress={()=>setNotifStatus(!notifStatus)}>
                                <Text style={styles.buttonText}>Enable Notifications</Text>
                                <Switch
                                    trackColor={{false: '#767577', true: '#81b0ff'}}
                                    thumbColor={COLORS.FOREGROUND}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={()=>setNotifStatus(!notifStatus)}
                                    value={notifStatus}
                                />
                            </Pressable>
                        </View>
                        <View>
                            <Text style={styles.title}>For You</Text>
                            <Pressable style={styles.buttonContainer} onPress={()=>setShowPastLaunches(!showPastLaunches)}>
                                <Text style={styles.buttonText}>Show Past Launches</Text>
                                <Switch
                                    trackColor={{false: '#767577', true: '#81b0ff'}}
                                    thumbColor={COLORS.FOREGROUND}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={()=>setShowPastLaunches(!showPastLaunches)}
                                    value={showPastLaunches}
                                />
                            </Pressable>
                            <Pressable style={styles.buttonContainer} onPress={()=>setShowPastEvents(!showPastEvents)}>
                                <Text style={styles.buttonText}>Show Past Events</Text>
                                <Switch
                                    trackColor={{false: '#767577', true: '#81b0ff'}}
                                    thumbColor={COLORS.FOREGROUND}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={()=>setShowPastEvents(!showPastEvents)}
                                    value={showPastEvents}
                                />
                            </Pressable>
                        </View>
                        
                        {/* <View style={{height: 800}}></View> */}
                        <View style={styles.buffer}></View>
                        <View>
                            <View style={styles.contactSection}>
                                <Text style={styles.title}>Contact Information</Text>
                                <View style={styles.smallBuffer}></View>
                                <Text style={styles.text}>Email: luwai.develop@gmail.com</Text>
                                <Text style={styles.subtext}>Please let me know if you find a bug, or if you have any feedback!</Text>
                            </View>
                            <Text style={styles.subtext}>Version: 0.2.1</Text>
                            <TouchableOpacity onPress={()=>clearCache()}>
                                <Text style={styles.dangerButton}>Clear Cache</Text>
                            </TouchableOpacity> 
                            <View style={styles.bottomPadding}></View>
                        </View>
                </View>
            </ScrollView>
        </View>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 100,
        marginTop: StatusBar.currentHeight+ TOP_BAR_HEIGHT,
        // marginBottom: BOTTOM_BAR_HEIGHT+20,
        // marginHorizontal: 10,
        // backgroundColor: "white",
        height: Dimensions.get('window').height ,
    },
    scrollContainer:{
        // backgroundColor: 'white',
        height: Dimensions.get('window').height - StatusBar.currentHeight- TOP_BAR_HEIGHT + BOTTOM_BAR_HEIGHT -20,
        flex: 1,
        justifyContent: 'space-between',

    },
    bottomPadding:
    {
        height: BOTTOM_BAR_HEIGHT,
    },
    text: {
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        textAlign: "left",
        marginLeft: 10,

    },
    subtext: {
        fontSize: 14,
        color: COLORS.SUBFOREGROUND,
        fontFamily: FONT,
        textAlign: "left",
        marginLeft: 10,
    },
    buffer:{
        height: 50,
    },
    smallBuffer:{
        height: 10,
    },
    title:{
        fontSize: 18,
        color: COLORS.SUBFOREGROUND,
        fontFamily: FONT,
        textAlign: "left",
        marginLeft: 10,
        marginBottom: -5,

    },
    buttonContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        // padding: 5,
        // margin: 10,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 0,
    },
    buttonText:{
        fontSize: 20,
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
    },
    dangerButton:{
        backgroundColor: COLORS.RED,
        borderRadius: 10,
        padding: 10,
        margin: 10,
        textAlign: "center",
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        fontSize: 20,
    },
    contactSection:{
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        margin: 10,
        paddingVertical: 10,
        marginBottom: 15,

        borderRadius: 10,
    }
})