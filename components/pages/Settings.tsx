import React, { useEffect , useState} from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Switch, Dimensions, Pressable, Alert} from 'react-native';
import { BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT } from '../styles';
import { ScrollView } from 'react-native-gesture-handler';

import { UserContext } from '../data/UserContext';

export default function Settings(){
    let userContext = React.useContext(UserContext);
    const [lastCallTime, setLastCallTime] = useState(getLastCallText());
    const [curSettings, setSettings] = useState(null);
    
    // Get user settings when loading
    useEffect(()=>{
        setSettings(userContext.settings);
        setLastCallTime(getLastCallText());
    }, []);


    // console.log("UserContext:", userContext);

    // console.log("Settings:", curSettings);

    // function changeSetting(){
    //     userContext.setSettings({
    //         enablenotifs: notifStatus,
    //         fyshowpastlaunches: showPastLaunches,
    //         fyshowpastevents: showPastEvents,
    //     })
    // }

    function getLastCallText(){
        let time = new Date().getTime() - parseInt(userContext.lastcall);
        if (time/1000 < 60){
            return (time/1000 +"s ago").toString();
        }
        else {
        return (Math.round(time/1000/60) +"min ago").toString();

        }
    }
    function toggleSetting(setting){
        console.log("Toggling Setting: "+setting+" to "+!curSettings[setting]);
        let settings = {...curSettings}

        if (settings == null){
            return
        }

        // Toggle setting in local copy
        settings[setting] = !settings[setting];

        // Set new settings in state
        setSettings(settings);

        // Save settings to context
        userContext.settings = settings;
        userContext.storeSettings();
    }



    function SettingToggle(props:{setting: string, title?: string}){
        // let toggleSetting = props.changeSetting;
        let setting = props.setting;
        let title = props.title;
        return (
            <Pressable style={styles.buttonContainer} onPress={()=>toggleSetting(setting)}>
                <Text style={styles.buttonText}>{title}</Text>
                <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={COLORS.FOREGROUND}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={()=>toggleSetting(setting)}
                    value={curSettings != null && curSettings[setting]}
                />
            </Pressable>
        )
    }

    function clearCache(){
        Alert.alert("Clear Data", "Are you sure you want to clear data?\n\nThis action will delete all stored launch data, event data, and stored settings on your device.\n\nThis may result in being unable to load API data, and causing the app not to be able to load for up to one hour", [
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
            {curSettings!=null && 
            <ScrollView>
                <View style={styles.scrollContainer}>
                    <View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.title}>Notifications</Text>
                            <SettingToggle setting="enablenotifs" title={"Enable Notifications"}/>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.title}>For You</Text>
                            <SettingToggle setting="fyshowpastlaunches" title={"Show Past Launches"}  />
                            <SettingToggle setting="fyshowpastevents"title={"Show Past Events"} />
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.title}>Developer</Text>
                            <SettingToggle setting="devmode" title={"Enable Dev Mode"} />
                        </View>
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
                        <View style={styles.horizontalContainer}>
                            <Text style={styles.subtext}>Version: 0.2.2</Text>  
                        </View>
                        {curSettings.devmode &&
                        <View style={styles.horizontalContainer}>
                            <Pressable onPress={()=>{setLastCallTime(getLastCallText())}}>
                                <Text style={styles.subtext}>Last API Call: {lastCallTime}, (Tap to refresh)</Text>  
                                <Text style={styles.subtext}>API Link: https://ll.thespacedevs.com/2.2.0</Text>
                            </Pressable>
                        </View>
                        }
                        <TouchableOpacity onPress={()=>clearCache()}>
                            <Text style={styles.dangerButton}>Clear Data</Text>
                        </TouchableOpacity> 
                        <View style={styles.bottomPadding}></View>
                    </View>
                </View>
            </ScrollView>
        }   
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
        display: 'flex',
        justifyContent: 'space-between',

    },
    sectionContainer:{
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        margin: 10,
        // paddingVertical: 10,
        paddingTop: 10,
        // marginBottom: 15,

        borderRadius: 10,

    },
    bottomPadding:
    {
        height: BOTTOM_BAR_HEIGHT,
    },
    horizontalContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        // padding: 5,
        // margin: 10,
        borderRadius: 10,
        marginHorizontal: 5,
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
        marginBottom: 5,
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