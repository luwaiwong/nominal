import React, { useRef, useState, useContext } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Button} from "react-native";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from "react-native";
import { WidgetPreview } from "react-native-android-widget";


import Index from "./App";
import LaunchesPage from "src/components/pages/Launches";
import LaunchPage from "src/components/pages/launches/LaunchPage";
import Launches from "src/components/pages/Launches";
import EventPage from "src/components/pages/events/EventPage";
import EventsPage from "src/components/pages/events/EventsPages";
import NewsPage from "src/components/pages/subpages/NewsPages";
import Events from "src/components/pages/Events";

import { COLORS } from "src/constants/styles";
import { useEffect } from "react";
import FirstLoad from "src/components/pages/subpages/FirstLoad";
import ISSPage from "src/components/pages/locations/ISSPage";
import StarshipPage from "src/components/pages/locations/StarshipPage";

import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { WidgetTaskHandler } from "src/components/widgets/WidgetTaskHandler";
import { registerRootComponent } from "expo";

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

function setNotifications(){
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
}

export default function index(props) {
  setNotifications();


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
    </View>
    );

  }