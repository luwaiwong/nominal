import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'; 
import { View, Text , StyleSheet, Dimensions, Animated, ViewBase, Pressable, KeyboardAvoidingView, Platform} from 'react-native'; 
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons'; 
import { BlurView } from 'expo-blur';

// import { BlurView } from '@react-native-community/blur';

import {COLORS, FONT, BOTTOM_BAR_HEIGHT} from '../styles';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { UserContext } from '../data/UserContext';

const MenuBar = ({ state, descriptors, navigation}: any) => {
    const userContext = useContext(UserContext);
    
    const bottomAnim = useRef(new Animated.Value(10)).current;

    // useEffect(()=>{
    //     if (page.current == 0) hideMenu();
    //     else showMenu();
    // }, [page.current]);

    useEffect(()=>{
        if (userContext != null){
            userContext.showMenu = showMenu;
            userContext.hideMenu = hideMenu;
        }
        
    }, [userContext]);


    const showMenu = ()=>{
        Animated.spring(bottomAnim, {
            toValue: 0,
            friction: 10,
            useNativeDriver: false,
        }).start();
    }

    const hideMenu = ()=>{
        Animated.spring(bottomAnim, {
            toValue: -80,
            friction: 10,
            useNativeDriver: false,
        }).start();
    }

    return (
        <Animated.View style={[styles.menuBar]}>
            {
                state.routes.map((route: any , index: number) => {
                    const { options } = descriptors[route.key];
                    const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };
                    
                    if (label == "Home"){
                        return <MenuButton icon="home" setPage={onPress}  active={isFocused} />
                    }
                    if (label == "Launches"){
                        return <MenuButton icon="rocket-launch" setPage={onPress}  active={isFocused} />
                    }
                    if (label == "News"){
                        return <MenuButtonCommunity icon="newspaper-variant" setPage={onPress}  active={isFocused} />
                    }
                    if (label == "Settings"){
                        return <MenuButton icon="settings" setPage={onPress}  active={isFocused} />
                    }
                    return (
                    <View key = {index}>
                        <Pressable
                        onPress = {onPress}
                        style = {{backgroundColor: isFocused?"#030D16": "#182028", borderRadius: 20, }}>
                        <View style = {{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 15}}>
                            <Text>{label}</Text>
                        </View>
                        </Pressable>
                    </View>
                    );
                })
            }   
        
        </Animated.View>
    );
}
function MenuButton({icon, setPage, active}){
    function onPressed(){
        setPage();
    }
    let tap = Gesture.Tap();
    tap.onFinalize(()=>onPressed());
    
    return (
        <GestureDetector gesture={tap}>
            <View style={active?styles.buttonContainerActive:styles.buttonContainer}>
                <MaterialIcons name={icon} style={active?styles.buttonIconActive:styles.buttonIcon} />
            </View>
        </GestureDetector>
    );

}


function MenuButtonCommunity({icon, setPage,active}){
    function onPressed(){
        setPage();
    }
    let tap = Gesture.Tap();
    tap.onFinalize(()=>onPressed());
    
    return (
        <GestureDetector gesture={tap}>
            <View style={active?styles.buttonContainerActive:styles.buttonContainer}>
                <MaterialCommunityIcons name={icon} style={active?styles.buttonIconActive:styles.buttonIcon} />
            </View>
        </GestureDetector>
    );

}




const styles = StyleSheet.create({
    menuBar: {
        flexDirection: 'row',
        justifyContent:"space-around",
        alignContent: "center",

        position: 'absolute',
        // width: "100%",
        width: Dimensions.get("window").width,
        height: BOTTOM_BAR_HEIGHT-10,
        

        bottom: 0,
        backgroundColor: COLORS.BACKGROUND,
        // borderRadius: 10,
        // marginHorizontal: 5,

    },
    blurViewContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        
        backgroundColor: 'rgba('+COLORS.BACKGROUND_HIGHLIGHT_RGB+' 0)',
        // backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        padding: 4,
        paddingVertical: 0,


        // width: Dimensions.get('window').width-20,
        width: "100%",
        // height: BOTTOM_BAR_HEIGHT-10,
        height: "100%",
        position: "absolute",
        // borderRadius: 10,
        overflow: "hidden",

        zIndex: 4000,
    },
    menuContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        
        backgroundColor: 'rgba('+COLORS.BACKGROUND_RGB+' 1)',
        // backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        padding: 4,
        paddingVertical: 0,


        // width: Dimensions.get('window').width-10,
        width: "100%",
        height: "100%",
        position: "absolute",
        // borderRadius: 10,
        overflow: "hidden",
        elevation: 10,

        zIndex: 5000,
    },
    titleText: {
        fontSize: 20,
        color: COLORS.FOREGROUND,
    },

    // Button
    buttonContainer:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        padding: 0,
        paddingTop: 3,
        flex: 1,
        zIndex  : 100,
    },
    buttonContainerActive:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: "100%",
        width: "80%",
        // backgroundColor: COLORS.FOREGROUND,
        padding: 0,
        paddingTop: 3,
        flex: 1,

        borderRadius: 20,
        zIndex  : 100,

    },
    buttonIcon: {
        fontSize: 38,
        color: COLORS.SUBFOREGROUND,
        opacity: 0.4,
    },
    buttonIconActive: {
        fontSize: 42,
        marginBottom: 2,
        color: COLORS.SUBFOREGROUND,
        opacity: 1,
    },
    buttonText: {
        fontSize: 13,
        fontFamily: FONT,
        color: COLORS.FOREGROUND,
        
        // marginTop:-8,
        marginBottom: 4,
    },
});
export default MenuBar
