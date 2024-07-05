import { StyleSheet, View, Text } from 'react-native';

export default function LaunchPages(props) {
    console.log(props.route.params.title)
    return (
        <View style={styles.container}>
            <Text>{props.route.params.title}</Text>
            {props.route.params.data.map((launch, index) => {return <Text key={index}>{launch.name}</Text>})}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        backgroundColor : 'white',
        // zIndex: 100,
    },
    text: {
        fontSize: 20,
        color: 'black',
    },
})