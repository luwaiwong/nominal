import PagerView from "react-native-pager-view";
import { StyleSheet } from "react-native";

import ImmersivePage from "../../styled/ImmersivePage";
import {COLORS, FONT} from "../../styles"

export default function Immersive(props){
    const upcomingLaunches = props.upcomingLaunches;
    const userData = props.userData;
    return(
      <PagerView style={styles.immersiveSection} initialPage={0} orientation="vertical" >
        {upcomingLaunches.map((launch: any) => {
            return (
              <ImmersivePage key={launch.id} data={launch} user={userData}/>
            );
        })}
      </PagerView>
    );
}


const styles = StyleSheet.create({
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
  immersivePage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    
    width: '100%',
    height: '100%',


    paddingTop: 60,
    backgroundColor: COLORS.FOREGROUND,
  },
  immersivePageTitle:{
    fontSize: 32,
    color: COLORS.BACKGROUND,
    fontFamily: COLORS.ACCENT,
    margin: 16,
  },
});