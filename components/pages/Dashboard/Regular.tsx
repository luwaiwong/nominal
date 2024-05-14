import {useState} from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import LaunchInfo from '../../styled/LaunchInfo';
import HighlightLaunchInfo from '../../styled/HighlightLaunchInfo';
import Loading from '../../styled/Loading';

import {COLORS, FONT, BOTTOM_BAR_HEIGHT, TOP_BAR_HEIGHT} from '../../styles';

export default function Regular(props) {
    let [pinnedShown, setPinnedShown] = useState<any>(true);
    let [previousShown, setPreviousShown] = useState<any>(true);
    let [upcomingShown, setUpcomingShown] = useState<any>(true);

    let pinnedLaunches = props.pinnedLaunches;
    let upcomingLaunches = props.upcomingLaunches;
    let previousLaunches = props.previousLaunches;
    let userData = props.userData;

    function Content(){
      return (
        <SafeAreaView>
            <View>
                    {/* Padding for title bar */}
                    <View style={styles.topPadding}/>
                {/* Scolling Area */}
                <ScrollView >   

                    {/* Highlight Launch */}
                    {upcomingLaunches[0] != undefined && <HighlightLaunchInfo data={upcomingLaunches[0]}  />}

                    {/* Pinned Launches */}
                    <View>
                        <Pressable onPress={()=>setPinnedShown(!pinnedShown)}>
                            <View style={styles.contentHeaderSection} >
                            <Text style={styles.contentHeaderText}>Pinned </Text>
                            <MaterialIcons 
                                name="arrow-forward-ios" 
                                style={pinnedShown?styles.contentHeaderIcon:styles.contentHeaderIconHidden} 
                            />
                            </View>
                        </Pressable>
                        <View style={styles.contentSeperator}></View>

                        {/* <View style={[styles.contentSection,{height:pinnedShown?"auto":0}]}>
                            {pinnedLaunches.map((launch: any) => {
                            return (
                                <LaunchInfo key={launch.id} data={launch} user={userData} />
                            );
                        })}
                        </View>  */}
                    </View>
                    

                    {/* Upcoming Section */}
                    <View style={styles.contentHeaderSection} >
                        <Text style={styles.contentHeaderText} onPress={()=>setUpcomingShown(!upcomingShown)}>Filtered </Text>
                        <MaterialIcons 
                        name="arrow-forward-ios" 
                        style={upcomingShown?styles.contentHeaderIcon:styles.contentHeaderIconHidden} 
                        onPress={()=>setUpcomingShown(!upcomingShown)}
                        />
                    </View>
                    <View style={styles.contentSeperator}></View>

                    {/* Previous Launches */}
                    <View style={[styles.contentSection]}>
                        {previousLaunches.map((launch: any) => {
                        return (
                            <LaunchInfo key={launch.id} data={launch} user={userData}/>
                        );
                    })}
                    </View>
                    {/* Upcoming Launches */}
                    <View style={[styles.contentSection]}>
                        {upcomingLaunches.map((launch: any) => {
                        return (
                            <LaunchInfo key={launch.id} data={launch} user={userData} />
                        );
                    })}
                    </View>
                    <View style={styles.bottomBuffer}/>
                </ScrollView>
            </View>
        </SafeAreaView>
      );
        
    }

    if (upcomingLaunches === undefined){
      return <Loading/>
    }
    return <Content/>;
    
}

const styles = StyleSheet.create({
    topPadding:{
      height: TOP_BAR_HEIGHT,
      width: "100%",
    },
    // Content Section
    contentSection: {
      display: 'flex',
      backgroundColor: COLORS.BACKGROUND,
      overflow: 'hidden',
    },
    contentHeaderSection: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    contentHeaderText: {
      fontSize: 32,
      color: COLORS.FOREGROUND,
      fontFamily: FONT,
      
      marginLeft: 8,
      marginBottom: 5,
    },
    contentHeaderIcon: {
      color: COLORS.FOREGROUND,
      fontSize: 28,
      marginLeft: 8,
      marginBottom: 8,
    },
    contentHeaderIconHidden: {
      color: COLORS.FOREGROUND,
      fontSize: 28,
      marginLeft: 8,
      marginBottom: 8,
      transform: [{ rotate: '90deg'}],
    },
    contentSeperator:{
      width: '95%',
      height: 3,
      borderRadius: 100,

      marginLeft: '2.5%',
      marginBottom: 20,

      backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
    },
    bottomBuffer:{
        height: BOTTOM_BAR_HEIGHT+140,
    }
});