import React, { useContext } from 'react';
import { useEffect, useState } from 'react';
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';

import {COLORS, FONT, FOREGROUND}from "../styles";
import Launch from './LaunchSimple';
import { UserContext } from '../data/UserContext';

const timerTickLength = 20;
export default function LaunchCarousel(props:{content, type, nav}){
    let userContext = useContext(UserContext);
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
        if (pagerRef.current != null){
            pagerRef.current.setPage(page); 
        }

    }

  
    return (
        <>
            <View style={[styles.contentSection , {marginTop: 0}]}>
            <TouchableOpacity onPress={() => props.nav.navigate("Launches", {data:userContext.launches.previous,title:"Recent Launches"})}>
                <View style={styles.contentHeaderSection} >
                    <Text style={styles.contentHeaderText} >Recent Launches</Text>

                    <View style={styles.seeMoreSection}>
                    <Text style={styles.contentSeeMore} >See All </Text>
                    <MaterialIcons 
                    name="arrow-forward-ios" 
                    style={styles.contentHeaderIcon} 
                    />

                    </View>
                </View>
            </TouchableOpacity>
            <PagerView 
                
                ref={pagerRef} 
                style={{height: 145}} 
                initialPage={0}
                onPageSelected={onPageSelected}>
                
                
                {props.type == "launch" && content.map((launch: any) => {
                return (
                    <Launch key={launch.id} data={launch}/>

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
      elevation: 2,
    },

    contentHeaderSection: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    contentHeaderText: {
      fontSize: 20,
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
        width: 10,
        height: 10,
        borderRadius: 6,
        backgroundColor: COLORS.FOREGROUND,

        // margin: 5,
        marginHorizontal: 10,

    },
    scrollIndicatorDisabled:{
        width: 8,
        height: 8,

        borderRadius: 6,
        // backgroundColor: COLORS.FOREGROUND,
        
        borderColor: COLORS.FOREGROUND,
        borderWidth: 1,

        // margin: 5,
        marginHorizontal: 10,
    }
});