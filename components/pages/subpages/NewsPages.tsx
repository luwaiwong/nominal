import { StyleSheet, View, Text, FlatList, StatusBar, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { COLORS, FONT, TOP_BAR_HEIGHT } from '../../styles';
import Article from '../../styled/Article';
import ArticleDescriptive from '../../styled/ArticleDescriptive';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../data/UserContext';
import Loading from '../../styled/Loading';


const NEWS_API_URL = "https://api.spaceflightnewsapi.net/v4/";


export default function NewsPage(props) {
    let userContext = useContext(UserContext);

    // Check has data
    if (userContext == null || userContext.news == null){
        return <Loading/>
    }

    let callingData = useRef(false);
    let currentOffset = useRef(0);
    const [data, setData] = useState([]);

    
    const refreshOpacity = useRef(new Animated.Value(0)).current

    const startRefreshAnimation = () => {Animated.loop(
        Animated.sequence([
            Animated.timing(
            refreshOpacity,
            {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
                delay: 0,
            }
            ),
            Animated.timing(
            refreshOpacity,
            {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
                delay: 0,
            }
            )
        ])
        ).start()
    }

    useEffect(() => {
        // if (userContext != null && userContext.news != null){
        //     setData(userContext.news)
        // }
        
        getMoreData();
    }, [])

    const onEndReached = () => {
        console.log("End Reached")
        getMoreData();
    }

    async function getMoreData(){
        console.log("Getting More Data")
        if (callingData.current){
            return
        }

        callingData.current = true;
        startRefreshAnimation()
        await fetch(NEWS_API_URL+"articles/?offset="+currentOffset.current).then((response) => {
            // console.log(response)
            return response.json()
        }).then((articles) => {
            if (articles == null){
                console.log("Article data null")
                callingData.current = false;
                refreshOpacity.setValue(0)
                return
            }
            setData([...data,...articles.results])
            currentOffset.current = currentOffset.current + 10;
            callingData.current = false;
            refreshOpacity.setValue(0)
        }).catch((error) => {
            console.log("Error fetching article data", error)
            callingData.current = false;
            refreshOpacity.setValue(0)
        })
    }
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
            
            {/* <View pointerEvents='none' style={styles.reloadingDataIndicator}> */}
                <Animated.Text style={[styles.reloadingDataText, {opacity: refreshOpacity}]} >Loading Articles...</Animated.Text>
            {/* </View> */}
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                style={styles.list}
                renderItem={({ item }) => <ArticleDescriptive articleData={item}></ArticleDescriptive>}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
            >
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
    },
    reloadingDataIndicator:{
        position: "absolute",
        bottom: COLORS.BOTTOM_BAR_HEIGHT+50,
        width: "100%",
        height: 5,
        zIndex: 100000,
    },
    reloadingDataText:{
        position: "absolute",
        bottom: 20,

        backgroundColor: COLORS.BACKGROUND_HIGHLIGHT,
        width: 200,
        // height: 50,
        fontSize: 20,

        borderRadius: 15,
        paddingVertical: 5,

        marginLeft: Dimensions.get("window").width/2-100,
        // width: "100%",
        textAlign: "center",
        color: COLORS.FOREGROUND,
        fontFamily: FONT,
        zIndex: 10000,
    }
})