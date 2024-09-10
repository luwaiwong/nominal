import { StyleSheet, View, Text, FlatList, StatusBar, Pressable } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { COLORS, FONT, TOP_BAR_HEIGHT } from 'src/constants/styles';
import Launch from "src/components/styled/Launch"
import { useContext, useState } from 'react';
import { UserContext } from 'src/utils/UserContext';

export default function LaunchesPage(props) {
    let userContext = useContext(UserContext);
    const data = props.route.params.data;
    const user = props.route.params.user;
    const title = props.route.params.title;
    const [devMode, setDevmode] = useState(false);
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <MaterialIcons 
                    name="arrow-back-ios" 
                    style={styles.back} 
                    onPress={() => props.navigation.goBack()}>
                </MaterialIcons>
                <Pressable onPress={()=>setDevmode(!devMode)} style={styles.title}>
                    <Text style={styles.title}>{title}</Text>
                </Pressable>
            </View>
            { (userContext.settings.devmode && devMode && false)?<FlatList
                data={title == "Upcoming Launches"?userContext.launches.upcoming:userContext.launches.previous}
                keyExtractor={(item, index) => index.toString()}
                style={styles.list}
                renderItem={({ item }) => <DevText item={item}></DevText>}>
            </FlatList>: <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                style={styles.list}
                renderItem={({ item }) => <Launch data={item} user={user} nav={props.navigation}>{item.name}</Launch>}>
            </FlatList>}
            
            
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