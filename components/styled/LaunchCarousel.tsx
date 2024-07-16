import React from 'react';
import { useEffect, useState } from 'react';
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import PagerView from 'react-native-pager-view';

import {COLORS, FONT, FOREGROUND}from "../styles";
import Launch from './LaunchSimple';

const timerTickLength = 7.5
export default function LaunchCarousel(props:{content, userData, type, nav}){
    let content = props.content;
    let length = content.length;
    let [currentPage, setCurrentPage] = useState(0);
    let pagerRef = React.useRef(null);
        
    // Called when the page is changed
    const onPageSelected = (event) => {
        // Handle page selection
        const { position } = event.nativeEvent;

        setCurrentPage(position);
    };

    // Ticking function
    useEffect(() => {
        const interval = setInterval(() => {
            setPage((currentPage + 1) % length);
        }, timerTickLength * 1000);
        return () => clearInterval(interval);
    }, [currentPage]);

    function setPage(page){
        // console.log(page)
        if (pagerRef.current != null){
            pagerRef.current.setPage(page); 
        }

    }

  
    return (
        <>
            <View style={[styles.contentSection , {marginTop: 0}]}>
            <Pressable onPress={() => props.nav.navigate("Launches", {data:props.userData.getPrevious(),user: props.userData, title:"Recent Launches"})}>
                <View style={styles.contentHeaderSection} >
                    <Text style={styles.contentHeaderText} >Recent </Text>

                    <View style={styles.seeMoreSection}>
                    <Text style={styles.contentSeeMore} >See All </Text>
                    <MaterialIcons 
                    name="arrow-forward-ios" 
                    style={styles.contentHeaderIcon} 
                    />

                    </View>
                </View>
            </Pressable>
            <PagerView 
                
                ref={pagerRef} 
                style={{height: 145}} 
                initialPage={0}
                onPageSelected={onPageSelected}>
                
                
                {props.type == "launch" && content.map((launch: any) => {
                return (
                    <Launch key={launch.id} data={launch} user={props.userData} nav={props.nav}/>

                );
            })}
            </PagerView>
            {/* <Text>GBRU</Text> */}
            <View style={styles.scrollIndicatorContainer}>
                {
                    content.map((item, index) => {
                        return (
                            <ScrollIndicator enabled={index == currentPage} key={index} />
                        );
                    })
                }
                </View>
            </View>
        </>
    )
}

function ScrollIndicator(props: {enabled}){
    if (props.enabled){
        return (
            <View style={styles.scrollIndicatorEnabled}></View>
        );
    }else{
        return (
            <View style={styles.scrollIndicatorDisabled}></View>
        );
    
    }

}

const styles = StyleSheet.create({
    
    // Content Section
    contentSection: {
      display: 'flex',
      backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
      borderRadius: 15,
      marginHorizontal: 10,
      marginTop: 10,
      overflow: 'hidden',
    },

    contentHeaderSection: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    contentHeaderText: {
      fontSize: 22,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,


      
      marginLeft: 12,
      // marginBottom: 5,
    },
    contentSeeMore: {
      fontSize: 18,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      
      // marginLeft: 12,
      marginBottom: 2,
      // marginRight: 12,
    },

    seeMoreSection:{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginRight: 12,
    },
    contentHeaderIcon: {
      color: COLORS.FOREGROUND,
      fontSize: 18,
      marginTop: 8,
      // marginLeft: 8,
      marginBottom: 5,
    },
    scrollIndicatorContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,

        flex: 1,
    },
    scrollIndicatorEnabled:{
        width: 8,
        height: 8,
        borderRadius: 6,
        backgroundColor: COLORS.FOREGROUND,

        margin: 5,

    },
    scrollIndicatorDisabled:{
        width: 6,
        height: 6,

        borderRadius: 6,
        // backgroundColor: COLORS.FOREGROUND,
        
        borderColor: COLORS.FOREGROUND,
        borderWidth: 0.5,

        margin: 5,
    }
});