import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import LaunchesPage from "./components/pages/subpages/LaunchesPage";
import Index from "./Index";
import { COLORS } from "./components/styles";
import EventsPage from "./components/pages/subpages/EventsPages";
import NewsPage from "./components/pages/subpages/NewsPages";
import LaunchPage from "./components/pages/subpages/LaunchPage";

const Stack = createStackNavigator();
export default function App() {
  return (
    <View style={{flex:1, backgroundColor:COLORS.BACKGROUND}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown:false, 
            cardOverlay: () => (
              <View
                style={{
                flex: 1,
                // backgroundColor: 'rgba(38,38,38,0.5)',
                backgroundColor: COLORS.BACKGROUND,
              }}
            />),
            transitionSpec:{
              open: {animation: 'timing', config: {duration: 100, delay: 0}},
              close: {animation: 'timing', config: {duration: 100, delay: 0}},
            }
          }}
          
          >
          <Stack.Screen 
            name="Index" 
            component={Index}></Stack.Screen>

          <Stack.Screen 
            name = "Launches"
            component = {LaunchesPage}
          ></Stack.Screen>
          <Stack.Screen 
            name = "Launch"
            component = {LaunchPage}
          ></Stack.Screen>
          <Stack.Screen 
            name = "All Events"
            component = {EventsPage}
            options={{transitionSpec: {open: {animation: 'timing', config: {duration: 0, delay: 0}}, close: {animation: 'timing', config: {duration: 0, delay: 0}},}}}
          ></Stack.Screen>
          <Stack.Screen 
            name = "All News"
            component = {NewsPage}
            options={{transitionSpec: {open: {animation: 'timing', config: {duration: 0, delay: 0}}, close: {animation: 'timing', config: {duration: 0, delay: 0}},}}}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
    );

  }