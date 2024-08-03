import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'; 
import { View, Text , StyleSheet, Dimensions, Animated, ViewBase} from 'react-native'; 
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons'; 
import { BlurView } from 'expo-blur';

// import { BlurView } from '@react-native-community/blur';

import {COLORS, FONT, BOTTOM_BAR_HEIGHT} from '../styles';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { UserContext } from '../data/UserContext';



// THIS IS A MESS. I'M SORRY. I'M NOT SORRY.

const styles = StyleSheet.create({
    menuBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        
        
        // backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        // padding: 4,


        width: Dimensions.get('window').width,
        height: BOTTOM_BAR_HEIGHT-10,
        position: "absolute",
        // bottom: BOTTOM_BAR_HEIGHT,
        // left: 10,
        // paddingHorizontal: 10,

        zIndex: 5000,
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

const MenuBar = React.forwardRef((props: any, ref: any)=> {
    const userContext = useContext(UserContext);
    const setPage = props.setPage;
    const page = props.page;

    const bottomAnim = useRef(new Animated.Value(-80)).current;

    // This is done so I can force a rerender of the menu bar from the parent
    const [f, forceRerender] = React.useState(0);
    useImperativeHandle(ref, ()=>({
        updatePage(){
            forceRerender((x)=>x+1);
        }
    }));
    
    useEffect(()=>{
        if (page.current == 0) hideMenu();
        else showMenu();
    }, [page.current]);

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

    if (page.current == -1) return null;
    if (setPage == null) return null;

    return (
        <Animated.View style={[styles.menuBar, {bottom: bottomAnim}]}>
            <BlurView intensity={0}  tint='dark' experimentalBlurMethod='dimezisBlurView' style={styles.blurViewContainer} >           
                {/* <MenuButton icon="settings" setPage={()=>setPage(0)} label="settings" active={page.current==0} />
                <MenuButton icon="rocket-launch" setPage={()=>setPage(1)} label="launches" active={page.current == 1} />
                <MenuButton icon="home" setPage={()=>setPage(2)} label="for you" active={page.current == 2} />
                <MenuButtonCommunity icon="newspaper-variant" setPage={()=>setPage(4)} label="news" active={page.current == 4 } /> */}
            </BlurView>
            <View style={styles.menuContainer}>
                
                <MenuButton icon="home" setPage={()=>setPage(1)}  active={page.current == 1} />
                <MenuButton icon="rocket-launch" setPage={()=>setPage(2)}active={page.current == 2} />
                <MenuButtonCommunity icon="newspaper-variant" setPage={()=>setPage(3)}active={page.current == 3} />
                {/* <MenuButtonCommunity icon="space-station" setPage={()=>setPage(3)} label="dashboard" active={page.current == 3} /> */}
                <MenuButton icon="settings" setPage={()=>setPage(4)}  active={page.current==4} />
            </View>
        </Animated.View>
    );
    
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

})
export default MenuBar
