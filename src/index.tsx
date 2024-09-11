import React, { useRef, useState, useContext } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Button} from "react-native";
import * as Notifications from 'expo-notifications';
import { WidgetPreview } from "react-native-android-widget";


import App from "./App";
import LaunchesPage from "src/pages/Launches";
import LaunchPage from "src/pages/launches/LaunchPage";
import Launches from "src/pages/Launches";
import EventPage from "src/pages/events/EventPage";
import EventsPage from "src/pages/events/EventsPages";
import NewsPage from "src/pages/subpages/NewsPages";
import Events from "src/pages/Events";

import { COLORS } from "src/styles";
import { useEffect } from "react";
import FirstLoad from "src/pages/subpages/FirstLoad";
import ISSPage from "src/pages/locations/ISSPage";
import StarshipPage from "src/pages/locations/StarshipPage";

import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { WidgetTaskHandler } from "src/widgets/WidgetTaskHandler";
import { registerRootComponent } from "expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QueryHandler } from "./utils/QueryHandler";
import { setNotifications } from "./utils/NotificationHandler";


// Register componet
registerRootComponent(index);
registerWidgetTaskHandler(WidgetTaskHandler);

// Create stack navigator for navigation
const Stack = createStackNavigator();

// Create Query Handler for API
const queryClient = QueryHandler

// Set notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export default function index(props) {
  // Register for notifications
  setNotifications();

  // Theme setup for navigation container
  const Theme = {
    dark: true,
    colors: {
      primary: COLORS.BACKGROUND,
      background: COLORS.BACKGROUND,
      card: COLORS.BACKGROUND,
      text: COLORS.TEXT,
      border: COLORS.BORDER,
      notification: COLORS.BACKGROUND,
    },
  }

  // Navigation setup
  return (
    <View style={{flex:1, backgroundColor:COLORS.BACKGROUND}}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={Theme} >
          <Stack.Navigator
            screenOptions={{
              headerShown:false, 
              presentation: 'modal',
              cardOverlay: () => (
                <View
                  style={{
                  flex: 1,
                  backgroundColor: 'rgba('+COLORS.BACKGROUND_RGB+'0.5)',
                  // opacity: 0
                  // backgroundColor: COLORS.BACKGROUND,
                }}
              />),
              transitionSpec:{
                open: {animation: 'timing', config: {duration: 150, delay: 0}},
                close: {animation: 'timing', config: {duration: 150, delay: 0}},
              }
            }}
            >
            <Stack.Screen 
              name="Index" 
              component={App}
            >
            </Stack.Screen>
            <Stack.Screen 
              name = "All Launches"
              component = {Launches}
            ></Stack.Screen>
            <Stack.Screen 
              name = "All Events"
              component = {Events}
            ></Stack.Screen>
            <Stack.Screen 
              name = "Launches"
              component = {LaunchesPage}
            ></Stack.Screen>
            <Stack.Screen 
              name = "Launch"
              component = {LaunchPage}
            ></Stack.Screen>
            <Stack.Screen 
              name = "Event"
              component = {EventPage}
            ></Stack.Screen>
            <Stack.Screen 
              name = "Events"
              component = {EventsPage}
            ></Stack.Screen>
            <Stack.Screen 
              name = "All News"
              component = {NewsPage}
            ></Stack.Screen>
            <Stack.Screen
              name = "First Load"
              component = {FirstLoad}
              options={{transitionSpec: {open: {animation: 'timing', config: {duration: 0, delay: 0}}, close: {animation: 'timing', config: {duration: 0, delay: 0}},}}}
            ></Stack.Screen>
            <Stack.Screen
              name = "ISS"
              component={ISSPage}
            ></Stack.Screen>
            <Stack.Screen
              name = "Starship"
              component={StarshipPage}
            ></Stack.Screen>
            <Stack.Screen
              name = "Widget Preview"
              component={WidgetPreview}
            ></Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </View>
    );

  }