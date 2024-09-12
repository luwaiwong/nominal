import {  StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
import Event from "src/components/Event";
import EventSmall from "src/components/EventSmall";
import LaunchSimple from "src/components/LaunchSmall";
import { COLORS, FONT } from "src/styles";


export function LaunchItemList(props:{data:any, title:string}){
    return (
        <View style={[styles.contentSection]}>
            <TouchableOpacity onPress={()=> {}}>
            <View style={styles.contentHeaderSection} >
                <Text style={styles.contentHeaderText} >{props.title}</Text>
                <View style={styles.seeMoreSection}>
                    <Text style={styles.contentSeeMore} >See All </Text>
                    <MaterialIcons 
                    name="arrow-forward-ios" 
                    style={styles.contentHeaderIcon} 
                    />
                </View>
            </View>
            </TouchableOpacity>
            {props.data.map((item: any) => {
            return (
                <LaunchSimple key={item.id} data={item} />
            );
            })}
        </View>
    )
}
export function EventItemList(props:{data:any, title:string, highlight?: boolean}){
    // console.log(props.highlight)
    function MapData(){
        if (props.highlight){
            return(
                <>
                    <Event data={props.data[0]} />
                    {props.data.slice(1).map((item: any) => {
                        return (
                            <EventSmall key={item.id} data={item} />
                        );
                    })}
                </>
            )
        } else {
            return (
            <>
                {props.data.map((item: any) => {
                    return (
                        <Event key={item.id} data={item} />
                    );
                })}
            </>
            )
        }
    }

    return (
        <View style={[styles.contentSection]}>
            <TouchableOpacity onPress={()=> {}}>
            <View style={styles.contentHeaderSection} >
                <Text style={styles.contentHeaderText} >{props.title}</Text>
                <View style={styles.seeMoreSection}>
                    <Text style={styles.contentSeeMore} >See All </Text>
                    <MaterialIcons 
                    name="arrow-forward-ios" 
                    style={styles.contentHeaderIcon} 
                    />
                </View>
            </View>
            </TouchableOpacity>
            <MapData/>
        </View>
    )
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

      // elevation: 10,
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
      marginTop: 5
      // marginBottom: 5,
    },
    seeMoreSection:{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginRight: 12,
    },
    contentSeeMore: {
      fontSize: 18,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      
      // marginLeft: 12,
      marginBottom: 2,
      // marginRight: 12,
    },
    contentHeaderIcon: {
      color: COLORS.FOREGROUND,
      fontSize: 18,
      marginTop: 8,
      // marginLeft: 8,
      marginBottom: 5,
    },
})