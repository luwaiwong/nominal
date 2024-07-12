import React, { useImperativeHandle } from 'react'; 
import { View, Text , StyleSheet, Dimensions} from 'react-native'; 
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons'; 
import { BlurView } from 'expo-blur';

// import { BlurView } from '@react-native-community/blur';

import {COLORS, FONT, BOTTOM_BAR_HEIGHT} from '../styles';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';



// THIS IS A MESS. I'M SORRY. I'M NOT SORRY.

const styles = StyleSheet.create({
    menuBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        
        backgroundColor: 'rgba('+COLORS.BACKGROUND_HIGHLIGHT_RGB+' 0.4)',
        // backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        padding: 4,


        width: Dimensions.get('window').width-20,
        height: BOTTOM_BAR_HEIGHT-10,
        position: "absolute",
        bottom: 10,
        left: 10,
        borderRadius: 10,
        overflow: "hidden",

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

    },
    buttonIcon: {
        fontSize: 35,
        color: COLORS.SUBFOREGROUND,
    },
    buttonIconActive: {
        fontSize: 45,
        marginBottom: 5,
        color: COLORS.FOREGROUND,
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
    const setPage = props.setPage;
    const page = props.page;

    // This is done so I can force a rerender of the menu bar from the parent
    const [f, forceRerender] = React.useState(0);
    useImperativeHandle(ref, ()=>({
        updatePage(){
            forceRerender((x)=>x+1);
        }
    }));

    if (page.current == -1) return null;
    if (setPage == null) return null;
    return (
        <BlurView intensity={45} tint='dark' experimentalBlurMethod='dimezisBlurView' style={styles.menuBar} >           
            <MenuButton icon="settings" setPage={()=>setPage(0)} label="settings" active={page.current==0} />
            <MenuButton icon="rocket-launch" setPage={()=>setPage(1)} label="launches" active={page.current == 1} />
            <MenuButton icon="home" setPage={()=>setPage(2)} label="for you" active={page.current == 2} />
            <MenuButtonCommunity icon="space-station" setPage={()=>setPage(3)} label="dashboard" active={page.current == 3} />
            <MenuButtonCommunity icon="newspaper-variant" setPage={()=>setPage(4)} label="news" active={page.current == 4 } />
        </BlurView>
    );
    
function MenuButton({icon, setPage, label, active}){
    function onPressed(){
        setPage();
    }
    let tap = Gesture.Tap();
    tap.onFinalize(()=>onPressed());
    
    return (
        <GestureDetector gesture={tap}>
            <View style={active?styles.buttonContainerActive:styles.buttonContainer}>
                <MaterialIcons name={icon} style={active?styles.buttonIconActive:styles.buttonIcon} />
                {/* <Text style={styles.buttonText}>{label}</Text> */}
            </View>
        </GestureDetector>
    );

}


function MenuButtonCommunity({icon, setPage, label, active}){
    function onPressed(){
        setPage();
    }
    let tap = Gesture.Tap();
    tap.onFinalize(()=>onPressed());
    
    return (
        <GestureDetector gesture={tap}>
            <View style={active?styles.buttonContainerActive:styles.buttonContainer}>
                <MaterialCommunityIcons name={icon} style={active?styles.buttonIconActive:styles.buttonIcon} />
                {/* <Text style={styles.buttonText}>{label}</Text> */}
            </View>
        </GestureDetector>
    );

}

})
export default MenuBar
