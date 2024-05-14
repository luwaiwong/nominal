import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import PagerView from 'react-native-pager-view';

import ImmersivePage from '../../styled/ImmersivePage';
import {COLORS} from '../../styles';

export default function Immersive(props){
    let userData = props.userData;
    let upcomingLaunches = props.upcomingLaunches;
    return (
      <View>
        <View style={styles.topPadding}></View>
        <PagerView style={styles.immersiveSection} initialPage={0} orientation="vertical" >
          {upcomingLaunches.map((launch: any) => {
              return (
                <ImmersivePage key={launch.id} data={launch} user={userData}/>
              );
          })}
        </PagerView>  
      </View>
    )
}
const styles = StyleSheet.create({
    topPadding:{
        height: 60,
    },
    immersiveSection:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        

        marginTop: -60,

        width: '100%',
        height: '100%',

        backgroundColor: COLORS.FOREGROUND,
    },
});