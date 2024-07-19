import React, { useEffect , useState} from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Switch, Dimensions, Pressable, Alert, TouchableHighlight, TouchableNativeFeedback} from 'react-native';
import { BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT } from '../styles';
import { ScrollView } from 'react-native-gesture-handler';

import { UserContext } from '../data/UserContext';

const versioncode = "0.3.1";

export default function Settings(){
    let userContext = React.useContext(UserContext);
    const [lastCallTime, setLastCallTime] = useState(getLastCallText());
    const [notifs, setNotifs] = useState([]);
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

    async function sendTestNotification(){
        let notifs = await userContext.sendTestNotification();
        setNotifs(notifs);
    }




    function SettingToggle(props:{setting: string, title?: string}){
        // let toggleSetting = props.changeSetting;
        let setting = props.setting;
        let title = props.title;
        return (
            <TouchableNativeFeedback onPress={()=>toggleSetting(setting)}>
                <View style={styles.toggleContainer} >
                    <Text style={styles.buttonText}>{title}</Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={COLORS.FOREGROUND}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>toggleSetting(setting)}
                        value={curSettings != null && curSettings[setting]}
                    />

                </View>
            </TouchableNativeFeedback>
        )
    }

    function clearCache(){
        Alert.alert("Clear Data", "Are you sure you want to clear data?\n\nThis action will delete all stored launch data, event data, and stored settings on your device.\n\nThis may result in being unable to load data, causing instability and the app to be unable to load for up to one hour\n\nPROCEED AT YOUR OWN RISK", [
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
                            <Text style={styles.description}>Allow Notifications</Text>


                            {curSettings.devmode && 
                                <View>
                                    <TouchableOpacity onPress={()=>{sendTestNotification()}}>
                                        <Text style={styles.button}>Send Test Notification</Text>
                                    </TouchableOpacity> 
                                    <Text style={styles.subtext}></Text>
                                    <Text style={styles.subtext}>Sends a test notification to your device, and also get/refresh scheduled notifications below</Text>
                                    <Text style={styles.subtext}></Text>
                                    <Text style={styles.subtext}>Scheduled Notifications: </Text> 
                                    {notifs != null && notifs.length > 0 ? 
                                        notifs.sort((a,b)=> a.trigger.value - b.trigger.value).map((notif, index) => {
                                            return (
                                            <View key={notif.identifier}>
                                                <Text style={styles.subtext} >{notif.content.title}</Text>
                                                <Text style={styles.subtext} >{new Date(notif.trigger.value).toISOString()}</Text>
                                            </View>)
                                                
                                        })
                                        :
                                        <Text style={styles.subtext}>No Notifications Scheduled</Text>
                                    }
                                </View>
                            }

                            <View style={styles.smallBuffer}></View>
                        </View>
                        
                        <View style={styles.sectionContainer}>
                            <Text style={styles.title}>For You</Text>
                            
                            <SettingToggle setting="fyshowpastlaunches" title={"Show Past Launches"}  />
                            <Text style={styles.description}>Show past launches in your For You feed. Reload Data to apply</Text>
                            <SettingToggle setting="fyshowpastevents"title={"Show Past Events"} />
                            <Text style={styles.description}>Show past events in your For You feed. Reload Data to apply</Text>
                            {/* <SettingToggle setting="fyshowupcomingevents"title={"Show Upcoming Events"} /> */}
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.title}>Developer</Text>
                            <SettingToggle setting="devmode" title={"Enable Developer Mode"} />
                            <Text style={styles.description}>Reveals additional debugging data in the app</Text>
                        </View>  
                    </View>
                    
                    <View>
                        <View style={styles.contactSection}>
                            <Text style={styles.title}>Contact Information</Text>
                            <View style={styles.smallBuffer}></View>
                            <Text style={styles.text}>Email: luwai.develop@gmail.com</Text>
                            <Text style={styles.subtext}>Please let me know if you find a bug, or if you have any feedback!</Text>
                        </View>
                        <View style={styles.horizontalContainer}>
                            <Text style={styles.subtext}>Note: Reloading data excessively may result in lag, reloading the app should fix the problem. </Text>
                        </View>
                        <View style={styles.smallBuffer}></View>
                        <View style={styles.horizontalContainer}>
                            <Text style={styles.subtext}>Version: {versioncode}</Text>  
                        </View>
                        {curSettings.devmode &&
                        <View style={styles.horizontalContainer}>
                            <Pressable onPress={()=>{setLastCallTime(getLastCallText())}}>
                                <Text style={styles.subtext}>Last API Call: {lastCallTime}, (tap to refresh)</Text>  
                                <Text style={styles.subtext}>API Link: https://ll.thespacedevs.com/2.2.0</Text>
                            </Pressable>
                        </View>
                        }
                        
                        <TouchableOpacity onPress={()=>{userContext.getData()}}>
                            <Text style={styles.button}>Reload Data</Text>
                        </TouchableOpacity> 
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
        // height: Dimensions.get('window').height - StatusBar.currentHeight- TOP_BAR_HEIGHT + BOTTOM_BAR_HEIGHT -20,
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        

    },
    sectionContainer:{
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        // margin: 10,
        marginHorizontal: 10,
        marginTop: 20,
        // paddingVertical: 10,
        paddingTop: 10,
        // marginBottom: 15,

        borderRadius: 10,
        borderWidth: 4,
        borderColor: COLORS.BACKGROUND_HIGHLIGHT,

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
    description: {
        fontSize: 14,
        color: COLORS.SUBFOREGROUND,
        fontFamily: FONT,
        textAlign: "left",
        marginLeft: 10,
        marginTop: -5,
        marginBottom: 10,
        marginRight: 10,
    },
    subtext: {
        fontSize: 14,
        color: COLORS.SUBFOREGROUND,
        fontFamily: FONT,
        textAlign: "left",
        marginLeft: 10,
        marginRight: 10,
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
    toggleContainer:{
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
        borderRadius: 20,
        padding: 10,
        margin: 10,
        
        textAlign: "center",
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        fontSize: 20,
    },
    button:{
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        borderRadius: 20,
        padding: 10,
        margin: 10,
        marginBottom: 0,
        textAlign: "center",
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        fontSize: 20,

        
    },
    contactSection:{
        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        margin: 10,
        marginTop: 20,
        paddingVertical: 10,
        marginBottom: 15,

        borderRadius: 10,
    }
})