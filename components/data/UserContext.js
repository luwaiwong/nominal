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

export const UserContext = React.createContext(null);

export function createUserContext() {
  let context = new UserData();
  return context;
}

//#region NOTIFICATIONS
async function schedulePushNotification(title, description, time) {
  // Check if time is a valid Date object
  if (!(time instanceof Date) || isNaN(time)) {
    console.error("Invalid date provided for scheduling notification");
    return;
  }
  // const trigger = new Date(time);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: description,
    },
    trigger: null,
  });
}

export class UserData {
  constructor() {
    // INFO
    this.name = "User Data";
    this.APIHandler = APIHandler;

    // State
    this.lastcall = 0;
    this.cache = undefined;
    this.notifs = [];
    this.gettingdata = false;

    this.gettingupcominglaunches = false;

    // Current User Data
    this.launches = undefined;
    this.news = undefined;
    this.events = undefined;
    this.starship = undefined;
    this.iss = undefined;

    // User Stuff
    this.nav = undefined;
    this.showMenu = undefined;
    this.hideMenu = undefined;

    this.settings = {
      // Notifications
      enablenotifs: true,
      notifevents: true,
      notiflaunches: true,
      notif24hbefore: true,
      notif12hbefore: false,
      notif1hbefore: true,
      notif30mbefore: false,
      notif10mbefore: true,
      notif0mbefore: false,

      // FOR YOU SETTINGS
      fyshowupcomingevents: true,
      fyshowpastlaunches: true,
      fyshowpastevents: true,

      // DEV
      devmode: false,
      waitbeforerefreshing: true,
      reloadonfocused: true,
    };

    // USER DATA
    this.pinned = [];
    this.tags = {
      launchProviders: [],
    };

    // FRONTEND STATE
    this.immersive = false;

    this.apiCallTimes = 0;
    console.log("Creating User Data");

    // Get settings
    this.getSettings();
  }

  //#region PUBLIC DATA FUNCTIONS
  async checkFirstLoad() {
    // return true;
    return await AsyncStorage.getItem("hasused")
      .then((data) => {
        if (data === null) {
          AsyncStorage.setItem("hasused", "true");
          console.log("First Load");
          return true;
        }
        return false;
      })
      .catch((error) => {
        console.log("Error checking first load: " + error);
        return false;
      });
  }

  async clearData() {
    try {
      await AsyncStorage.removeItem("lastcall");
      await AsyncStorage.removeItem("launches");
      await AsyncStorage.removeItem("events");
      await AsyncStorage.removeItem("news");
      await AsyncStorage.removeItem("starship");
      await AsyncStorage.removeItem("settings");
      await AsyncStorage.removeItem("hasused");
      console.log("Data Cleared");
    } catch (error) {
      console.log("Error clearing data: " + error);
    }
  }

  async getCache() {
    console.log("Getting Cache");
    const lastcall = JSON.parse(await AsyncStorage.getItem("lastcall"));
    const launches = JSON.parse(await AsyncStorage.getItem("launches"));
    const events = JSON.parse(await AsyncStorage.getItem("events"));
    const news = JSON.parse(await AsyncStorage.getItem("news"));
    const starship = JSON.parse(await AsyncStorage.getItem("starship"));
    const iss = JSON.parse(await AsyncStorage.getItem("iss"));

    let hasData =
      lastcall !== null &&
      launches !== null &&
      launches.upcoming != undefined &&
      events !== null &&
      events.upcoming != undefined &&
      news !== null;

    // Log the last call time
    if (hasData) {
      console.log(
        "Cache Time: " +
          (new Date().getTime() - parseInt(lastcall)) / 1000 +
          "s ago"
      );
    } else {
      console.log("No cache or incomplete cache found");
    }

    // Record last API time
    this.lastcall = parseInt(lastcall);

    // Check if data is outdated, if not then use cache
    if (hasData) {
      // Otherwise record cache for further use if unable to pull data
      this.cache = {
        launches: launches,
        events: events,
        news: news,
        starship: starship,
        iss: iss,
      };
    }
  }
  async getStarshipData() {
    // If starship data is undefined or last call was more than cachecalltime ago
    if (
      this.starship == undefined ||
      this.starship.upcoming == undefined ||
      this.starship.lastcall - new Date().getTime() > extradatacalltime
    ) {
      console.log("Fetching Starship Data");
      try {
        await this.fetchStarshipData();
        // Store after returning data
        setTimeout.bind(this, this.storeData(), 0);
        return this.starship;
      } catch (e) {
        console.log("Error fetching starship data: " + e);
      }
    }

    console.log("Returning Starship Cache");
    return this.starship;
  }
  async getISSData() {
    // If iss data is undefined or last call was more than cachecalltime ago
    if (
      this.iss == undefined ||
      this.iss.name == undefined ||
      this.iss.lastcall - new Date().getTime() > extradatacalltime
    ) {
      console.log("Fetching ISS Data");
      try {
        await this.fetchISSData();

        // Store after returning data
        setTimeout.bind(this, this.storeData(), 0);
        return this.iss;
      } catch (e) {
        console.log("Error fetching ISS data: " + e);
      }
    }

    console.log("Returning ISS Cache");
    return this.iss;
  }
  // Returns all required data
  async getData() {
    // Check scheduled notifications

    if (this.gettingdata) {
      return null;
    }

    this.gettingdata = true;

    try {
      await this.getCache();
    } catch (e) {
      console.log("Error getting Cache", e);
    }

    // Check if cache is eligble to be returned
    if (
      this.cache != undefined &&
      new Date().getTime() - this.lastcall < cachecalltime
    ) {
      console.log("Data fetched from cache");

      // this.launches = JSON.parse(this.cache.launches);
      // this.events = JSON.parse(this.cache.events);
      // this.news = JSON.parse(this.cache.news);
      // this.starship = JSON.parse(this.cache.starship);
      // this.iss = JSON.parse(this.cache.iss);
      this.launches = this.cache.launches;
      this.events = this.cache.events;
      this.news = this.cache.news;
      this.starship = this.cache.starship;
      this.iss = this.cache.iss;

      this.gettingdata = false;
      return this.#getData();
    }

    // Try fetching the data and return the upcoming launches
    try {
      let curTime = new Date().getTime();
      await this.getUpcomingData();
      await this.getPreviousData();
      await this.getPreviousEvents();
      await this.getEvents();
      await this.getNews();

      console.log("Data Fetched");
      // How long did it take to fetch data?
      let fetchTime = new Date().getTime() - curTime;
      console.log("Data Fetch Time: " + fetchTime / 1000 + "ms");

      // Record the last call time
      this.lastcall = new Date().getTime();

      this.gettingdata = false;

      // Calls the storedata function after returning the data
      setTimeout.bind(this, this.storeData(), 0);
      setTimeout.bind(this, this.scheduleNotifications(), 0);
      setTimeout.bind(this, this.getAllLaunches(), 0);

      return this.#getData();
    } catch (error) {
      // If unable to pull data
      console.log("Error getting data: " + error);
      console.log("Getting and returning cached data");

      this.launches = JSON.parse(this.cache.launches);
      this.events = JSON.parse(this.cache.events);
      this.news = JSON.parse(this.cache.news);
      this.starship = JSON.parse(this.cache.starship);
      this.iss = JSON.parse(this.cache.iss);

      this.gettingdata = false;
      return this.#getData();
    }
  }

  // Assume preexisting data exists
  async reloadData() {
    // if last fetch < 10 minutes ago, return cache
    if (
      this.settings.waitbeforerefreshing &&
      new Date().getTime() - this.lastcall < 1000 * 60 * 15
    ) {
      console.log("Last fetch < 15 minutes ago, returning cache");
      return this.#getData();
    }

    if (this.gettingdata) {
      return null;
    }
    this.gettingdata = true;
    console.log("Forcing Data Fetch");

    try {
      await this.getCache();
    } catch (e) {
      console.log("Error Getting Cache", e);
    }

    // Try fetching the data and return the upcoming launches
    try {
      let curTime = new Date().getTime();
      await this.getAllLaunches();
      await this.getEvents();
      await this.getNews();

      console.log("Data Fetched");
      // How long did it take to fetch data?
      let fetchTime = new Date().getTime() - curTime;
      console.log("Data Fetch Time: " + fetchTime / 1000 + "ms");

      // Record the last call time
      this.lastcall = new Date().getTime();

      // Calls the storedata function after returning the data
      setTimeout.bind(this, this.storeData(), 0);
      setTimeout.bind(this, this.scheduleNotifications(), 0);

      this.gettingdata = false;
      return this.#getData();
    } catch (error) {
      // If unable to pull data
      console.log("Error getting data: " + error);
      // Alert.alert("Error getting data: " + error);
      console.log("Returning cached data");

      this.launches = JSON.parse(this.cache.launches);
      this.events = JSON.parse(this.cache.events);
      this.news = JSON.parse(this.cache.news);

      this.gettingdata = false;

      return this.#getData();
    }
  }
  // Stores the data in local storage
  async storeData() {
    console.log("Storing Data");
    try {
      await AsyncStorage.setItem("lastcall", this.lastcall.toString());
      // console.log("Last call stored");
    } catch (error) {
      console.log("Error storing last call: " + error);
    }

    try {
      await AsyncStorage.setItem("launches", JSON.stringify(this.launches));
    } catch (error) {
      console.log("Error storing data: " + error);
    }

    try {
      await AsyncStorage.setItem("events", JSON.stringify(this.events));
      // console.log("Events stored");
    } catch (error) {
      console.log("Error storing events: " + error);
    }

    try {
      await AsyncStorage.setItem("news", JSON.stringify(this.news));
      // console.log("News stored");
    } catch (error) {
      console.log("Error storing news: " + error);
    }
    try {
      if (this.starship !== undefined) {
        await AsyncStorage.setItem("starship", JSON.stringify(this.starship));
        // console.log("Starship stored");
      }
    } catch (e) {
      console.log("Error Storing starship: " + e);
    }
    try {
      if (this.iss !== undefined) {
        await AsyncStorage.setItem("iss", JSON.stringify(this.iss));
        // console.log("ISS stored");
      }
    } catch (e) {
      console.log("Error Storing ISS: " + e);
    }
  }
  async getAllLaunches() {
    console.log("Getting all Launches");

    // First get 100 upcoming launches, then 100 previous launches, then 100 more of each

    // get 100 launches
    let data = [];
    try {
      data = await this.fetchLaunches("upcoming", 100, 0);
    } catch (error) {
      console.log("Error getting upcoming 100 launches: " + error);
    }

    // check that there is data
    if (data.length > 0) {
      this.#setLaunchData({ upcoming: data, previous: [] });
    }

    // Get 100 previous launches
    data = [];
    try {
      data = await this.fetchLaunches("previous", 100, 0);
    } catch (error) {
      console.log("Error getting upcoming 100 launches: " + error);
    }

    // check that there is data
    if (data.length > 0) {
      this.#setLaunchData({ upcoming: [], previous: data });
    }

    // store data
    this.storeData();
  }

  async getSettings() {
    try {
      const settings = await AsyncStorage.getItem("settings");
      if (settings !== null) {
        // Apply settings
        let cacheSettings = JSON.parse(settings);

        // Loop through all settings in cache and replace current settings
        for (let key in cacheSettings) {
          this.settings[key] = cacheSettings[key];
        }
        console.log("Settings fetched");
      } else {
        console.log("No settings found");
      }
    } catch (error) {
      console.log("Error getting settings: " + error);
    }
    return this.settings;
  }

  async storeSettings() {
    // Apply notification setting
    if (!this.settings.enablenotifs) {
      console.log("Cancelling Notifications");
      try {
        await Notifications.cancelAllScheduledNotificationsAsync();
      } catch (error) {
        console.log("Error cancelling notifications: " + error);
      }
    } else setTimeout.bind(this, this.scheduleNotifications(), 0);

    try {
      await AsyncStorage.setItem("settings", JSON.stringify(this.settings));
      console.log("Settings stored");
    } catch (error) {
      console.log("Error storing settings: " + error);
    }
  }
  // #endregion

  //#region NOTIFICATIONS
  async scheduleNotifications() {
    this.notifs = await scheduleNotifications(
      this.settings,
      this.launches,
      this.events
    );
    // console.log(this.notifs);
    return this.notifs;
  }

  async sendTestNotification() {
    console.log("Sending Test Notification");
    if (this.settings.enablenotifs) {
      schedulePushNotification(
        "Test Notification",
        "Rockets are cool!",
        new Date(Date.now() + 500)
      );
    }
    return await Notifications.getAllScheduledNotificationsAsync();
  }
  //#endregion

  // #region PRIVATE DATA FUNCTIONS
  #getData() {
    data = {
      launches: [],
      events: [],
      news: [],
    };
    data.launches = this.launches;
    data.events = this.events;
    return data;
  }
  //#endregion

  //#region DATA SETTING FUNCTIONS
  // Overrides launch data
  #setLaunchData(data) {
    if (this.launches === undefined)
      this.launches = {
        upcoming: [],
        previous: [],
      };

    // Check if has upcoming and previous launches
    if (
      data.upcoming != undefined &&
      data.upcoming != [] &&
      data.upcoming.length > 0
    ) {
      this.launches.upcoming = data.upcoming;
    }

    if (
      data.previous != undefined &&
      data.previous != [] &&
      data.previous.length > 0
    ) {
      this.launches.previous = data.previous;
    }
  }

  // Goes through each launch
  #updateLaunchData(data) {
    if (this.launches === undefined) {
      this.launches = {
        upcoming: [],
        previous: [],
      };
    }
  }

  #setEventData(data) {}
  //#region DATA FETCHING FUNCTIONS
  // Data fetching functions

  async fetchLaunches(type, limit, offset) {
    this.apiCallTimes += 1;
    console.log(
      "Fetching " +
        limit +
        " " +
        type +
        " Launches, API Calls: " +
        this.apiCallTimes
    );
    return await this.APIHandler.fetchLaunches(type, limit, offset)
      .then((data) => {
        data.lastCalledTime = new Date().getTime();
        return data;
      })
      .catch((error) => {
        console.log("Error fetching launches: " + error);
      });
  }
  async getUpcomingData() {
    this.apiCallTimes += 1;
    console.log("Getting Upcoming, API Calls: " + this.apiCallTimes);

    return await this.APIHandler.getUpcomingLaunches().then((data) => {
      data.lastCalledTime = new Date().getTime();

      let launches = {
        upcoming: data,
        previous: [],
      };
      this.#setLaunchData(launches);

      return this.launches;
    });
  }

  async getPreviousData() {
    this.apiCallTimes += 1;
    console.log("Getting Previous, API Calls: " + this.apiCallTimes);

    return await this.APIHandler.getPreviousLaunches().then((data) => {
      data.lastCalledTime = new Date().getTime();

      let launches = {
        upcoming: [],
        previous: data,
      };
      this.#setLaunchData(launches);

      return this.launches;
    });
  }

  async getNews() {
    console.log("Getting News");
    return await this.APIHandler.getNews()
      .then((data) => {
        if (data.results === undefined) {
          console.log("Error getting news: " + data);
          this.news = [];
          return this.news;
        }
        this.news = data.results;
        return this.news;
      })
      .catch((error) => {
        console.log("Error getting news: " + error);
        this.news = [];
        return this.news;
      });
  }

  async getEvents() {
    this.apiCallTimes += 1;
    console.log("Getting Events, API Calls: " + this.apiCallTimes);
    return await this.APIHandler.getEvents()
      .then((data) => {
        if (this.events === undefined)
          this.events = { upcoming: [], previous: [] };
        this.events.upcoming = [...data.results];
        return this.events;
      })
      .catch((error) => {
        console.log("Error getting events: " + error);
      });
  }
  async getPreviousEvents() {
    this.apiCallTimes += 1;
    console.log("Getting Previous Events, API Calls: " + this.apiCallTimes);
    return await this.APIHandler.getPreviousEvents()
      .then((data) => {
        if (this.events === undefined)
          this.events = { upcoming: [], previous: [] };
        this.events.previous = [...data.results];
        return this.events;
      })
      .catch((error) => {
        console.log("Error getting events: " + error);
      });
  }

  async fetchStarshipData() {
    this.apiCallTimes += 1;
    console.log("Getting Starship Data, API Calls: " + this.apiCallTimes);
    return await this.APIHandler.fetchStarshipDashboard()
      .then((data) => {
        if (this.starship === undefined) this.starship = {};
        this.starship = data;
        this.starship.lastcall = new Date().getTime();
        return data;
      })
      .catch((error) => {
        console.log("Error getting starship data: " + error);
      });
  }

  async fetchISSData() {
    this.apiCallTimes += 1;
    console.log("Getting ISS Data, API Calls: " + this.apiCallTimes);
    return await this.APIHandler.fetchISSData()
      .then((data) => {
        if (this.iss === undefined) this.iss = {};
        this.iss = data;
        this.iss.lastcall = new Date().getTime();
        return data;
      })
      .catch((error) => {
        console.log("Error getting ISS data: " + error);
      });
  }

  //#endregion
}
