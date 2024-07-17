import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Switch, Dimensions, Pressable} from 'react-native';
import { BOTTOM_BAR_HEIGHT, COLORS, FONT, TOP_BAR_HEIGHT } from '../styles';
import { ScrollView } from 'react-native-gesture-handler';

import { UserContext } from '../../App';

export default function Settings(){
    const [notifStatus, setNotifStatus] = React.useState(false);
    let userContext = React.useContext(UserContext);
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
                        
                        <View style={styles.buffer}></View>
                        {/* <View style={{height: 800}}></View> */}
                        <View style={styles.buffer}></View>
                        <View>
                            <Text style={styles.subtext}>Version: 0.2.0</Text>
                            <TouchableOpacity onPress={()=>userContext.clearData()}>
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
})