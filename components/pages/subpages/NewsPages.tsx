import { StyleSheet, View, Text, FlatList, StatusBar } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { COLORS, FONT, TOP_BAR_HEIGHT } from '../../styles';
import Article from '../../styled/Article';

export default function NewsPage(props) {
    const data = props.route.params.data;
    const user = props.route.params.user;
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <MaterialIcons 
                    name="arrow-back-ios" 
                    style={styles.back} 
                    onPress={() => props.navigation.goBack()}>
                </MaterialIcons>
                <Text style={styles.title}>Articles</Text>
            </View>
            
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                style={styles.list}
                renderItem={({ item }) => <Article articleData={item}></Article>}>
            </FlatList>
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
        fontSize: 26,
        color: COLORS.FOREGROUND,
        width: "100%",
        textAlign: 'center',
        alignContent: 'center',

        fontFamily: FONT,

        marginBottom: 10,
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