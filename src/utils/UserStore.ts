import React from "react";
import * as APIHandler from "./APIHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import Tags from "./Tags";

import { scheduleNotifications } from "./NotificationHandler";
import { create } from "zustand";

// Set cache call time
// If last call less than x minutes ago, use cache
const cachecalltime = 1000 * 60 * 60;
const extradatacalltime = 1000 * 60 * 90;
const twomin = 1000 * 60 * 2;

type State = {
  upcomingLaunches: [],
  previousLaunches: []
};

type Action = {
  setUpcomingLaunches: (data: State["upcomingLaunches"]) => void,
};

export const useUserStore = create<State & Action>((set) => ({
  upcomingLaunches: [],
  previousLaunches: [],
  setUpcomingLaunches: (data) => set(() => ({upcomingLaunches: data})),
  setPreviousLaunches: (data) => set(() => ({previousLaunches: data})),
}))
