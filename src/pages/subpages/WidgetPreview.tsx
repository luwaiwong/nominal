import { StyleSheet, View, Text, FlatList, StatusBar, Pressable } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { COLORS, FONT, TOP_BAR_HEIGHT } from '../../styles';
import Launch from 'src/components/Launch';
import { useContext, useState } from 'react';
import { UserContext } from "src/utils/UserContext"
import { WidgetPreview } from 'react-native-android-widget';
import { TestWidget } from '../../widgets/TestWidget';

export default function LaunchesPage(props) {
    const [devMode, setDevmode] = useState(false);
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <MaterialIcons 
                    name="arrow-back-ios" 
                    style={styles.back} 
                    onPress={() => props.navigation.goBack()}>
                </MaterialIcons>
                <Text style={styles.title}>Widget Previous</Text>
            </View>
            <WidgetPreview renderWidget={()=><TestWidget/>} width={320} height={200}/>
            
            
        </View>
    )
}

function DevText(data){
    return (
        <View>
            <Text style={styles.text}>{data.item.name}</Text>
            <Text style={styles.dev}>{JSON.stringify(data.item)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        backgroundColor : COLORS.BACKGROUND,
        // zIndex: 100,
    },
    titleContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginTop: StatusBar.currentHeight,
        height: TOP_BAR_HEIGHT,
    },
    title:{
        fontSize: 24,
        color: COLORS.FOREGROUND,
        width: "100%",
        textAlign: 'center',
        alignContent: 'center',

        fontFamily: FONT,

        marginBottom: 2,
    },
    dev:{
        fontSize: 14,
        color: COLORS.FOREGROUND,
        width: "100%",
        textAlign: 'center',
        alignContent: 'center',

        fontFamily: FONT,

        marginBottom: 20,
    },
    text: {
        fontSize: 20,
        color: COLORS.FOREGROUND,
    },
    list:{
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
        marginBottom: 10,
    },
    back:{
        position: 'absolute',
        width: 30,
        marginLeft: 10,

        fontSize: 26,
        color: COLORS.FOREGROUND,
        zIndex: 200,
    }
})