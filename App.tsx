import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import LaunchPages from "./components/pages/subpages/LaunchPages";
import Index from "./Index";
import { COLORS } from "./components/styles";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <View style={{flex:1, backgroundColor:COLORS.BACKGROUND}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown:false}}
          
          >
          <Stack.Screen 
            name="Index" 
            component={Index}></Stack.Screen>
          <Stack.Screen 
            name = "Launches"
            component = {LaunchPages}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
    );

  }