import React from "react";
import * as APIHandler from "./APIHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import Tags from "./Tags";

import { scheduleNotifications } from "./NotificationHandler";

// Set cache call time
// If last call less than x minutes ago, use cache
const cachecalltime = 1000 * 60 * 60;
const extradatacalltime = 1000 * 60 * 90;
const twomin = 1000 * 60 * 2;

export const NavContext = React.createContext(null);

export const UserContext = React.createContext(null);

export function createUserContext() {
  let context = new UserData();
  return context;
}
