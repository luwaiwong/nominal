import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import LaunchPages from "./components/pages/subpages/LaunchPages";
import Index from "./Index";
import { COLORS } from "./components/styles";

const Stack = createStackNavigator();
const config = {
  
}
export default function App() {
  return (
    <View style={{flex:1, backgroundColor:COLORS.BACKGROUND}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown:false, }}
          
          >
          <Stack.Screen 
            name="Index" 
            component={Index}></Stack.Screen>

          <Stack.Screen 
            name = "Launches"
            component = {LaunchPages}
            options={{transitionSpec: {open: {animation: 'timing', config: {duration: 200, delay: 0}}, close: {animation: 'timing', config: {duration: 500, delay: 300}},}}}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
    );

  }