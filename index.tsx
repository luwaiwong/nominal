import React, { useRef, useState, useContext } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Button} from "react-native";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from "react-native";

import Index from "./App";
import LaunchesPage from "./components/pages/subpages/Launches/LaunchesPage";
import EventsPage from "./components/pages/subpages/Events/EventsPages";
import NewsPage from "./components/pages/subpages/NewsPages";
import LaunchPage from "./components/pages/subpages/Launches/LaunchPage";
import EventPage from "./components/pages/subpages/Events/EventPage";

import {createUserContext, UserContext} from "./components/data/UserContext";

import { COLORS } from "./components/styles";
import { useEffect } from "react";
import FirstLoad from "./components/pages/FirstLoad";
import ISSPage, { ISSDashboard } from "./components/pages/subpages/Locations/ISSPage";
import StarshipPage from "./components/pages/subpages/Locations/StarshipPage";
import { WidgetPreview } from "react-native-android-widget";


import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { WidgetTaskHandler } from "./components/widgets/WidgetTaskHandler";
import { registerRootComponent } from "expo";
import Launches from "./components/pages/Launches";
import Events from "./components/pages/Events";

// Register componet
registerRootComponent(index);
registerWidgetTaskHandler(WidgetTaskHandler);


const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
    },
    trigger: null,
  })
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    
  } else {
    // alert('Must use physical device for Push Notifications');
  }

  return token;
}

export default function index(props) {
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => console.log(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // SET USER CONTEXT
  let user = useRef(null);

  useEffect(() => {
    if (user.current != null){
      return;
    }
    user.current = createUserContext(); 

    return () => {
      user.current = null;
    }
  }, []);

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

  return (
    <View style={{flex:1, backgroundColor:COLORS.BACKGROUND}}>
      <UserContext.Provider value={user.current}>
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
              component={Index}
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
      </UserContext.Provider>
      {/* <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      /> */}
    </View>
    );

  }