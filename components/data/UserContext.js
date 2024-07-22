import React from "react";
import * as APIHandler from "./APIHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import Tags from "./Tags";
import EventEmitter from "eventemitter3";
var EE = new EventEmitter();
// Set cache call time
// If last call less than x minutes ago, use cache
const cachecalltime = 1000 * 60 * 30;
const extradatacalltime = 1000 * 60 * 90;
const twomin = 1000 * 60 * 2;

export const UserContext = React.createContext(null);

export function createUserContext() {
  let context = new UserData();
  return context;
}

//#region NOTIFICATIONS
async function schedulePushNotification(title, description, time) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: description,
    },
    trigger: { date: time },
  });
}

export class UserData {
  constructor() {
    // INFO
    this.name = "User Data";
    this.APIHandler = APIHandler;
    this.systemTags = Tags;

    // State
    this.lastcall = 0;
    this.cache = undefined;
    this.notifs = [];
    this.gettingdata = false;

    // Current User Data
    this.launches = undefined;
    this.news = undefined;
    this.events = undefined;
    this.starship = undefined;
    this.iss = undefined;

    // User Stuff
    this.nav = undefined;

    this.settings = {
      // Notifications
      enablenotifs: true,
      notif24hbefore: true,
      notif12hbefore: false,
      notif1hbefore: true,
      notif30mbefore: false,
      notif10mbefore: true,
      notif0mbefore: false,

      notiflaunch24hbefore: true,
      notiflaunch12hbefore: false,
      notiflaunch1hbefore: true,
      notiflaunch30mbefore: false,
      notiflaunch10mbefore: true,
      notiflaunch0mbefore: false,

      notifevent24hbefore: true,
      notifevent12hbefore: false,
      notifevent1hbefore: true,
      notifevent30mbefore: false,
      notifevent10mbefore: true,
      notifevent0mbefore: false,

      // FOR YOU SETTINGS
      fyshowupcomingevents: true,
      fyshowpastlaunches: true,
      fyshowpastevents: true,

      // DEV
      devmode: false,
      waitbeforerefreshing: true,
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
    const lastcall = await AsyncStorage.getItem("lastcall");
    const launches = await AsyncStorage.getItem("launches");
    const events = await AsyncStorage.getItem("events");
    const news = await AsyncStorage.getItem("news");
    const starship = await AsyncStorage.getItem("starship");
    const iss = await AsyncStorage.getItem("iss");

    let hasData =
      lastcall !== null &&
      launches !== null &&
      launches.upcoming != [] &&
      events !== null &&
      events.upcoming != [] &&
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
    // console.log(this.starship);
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

      this.launches = JSON.parse(this.cache.launches);
      this.events = JSON.parse(this.cache.events);
      this.news = JSON.parse(this.cache.news);
      this.starship = JSON.parse(this.cache.starship);
      this.iss = JSON.parse(this.cache.iss);

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
      await this.getUpcomingData();
      await this.getEvents();
      await this.getNews();
      this.updateStarshipLaunchesAndEvents();

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
      console.log("Returning cached data");

      this.launches = JSON.parse(this.cache.launches);
      this.events = JSON.parse(this.cache.events);
      this.news = JSON.parse(this.cache.news);

      EE.emit("LaunchesFetched");

      this.gettingdata = false;

      return this.#getData();
    }
  }
  // Stores the data in local storage
  async storeData() {
    try {
      await AsyncStorage.setItem("lastcall", this.lastcall.toString());
      console.log("Last call stored");
    } catch (error) {
      console.log("Error storing last call: " + error);
    }

    try {
      await AsyncStorage.setItem("launches", JSON.stringify(this.launches));
      console.log("Launches stored");
    } catch (error) {
      console.log("Error storing data: " + error);
    }

    try {
      await AsyncStorage.setItem("events", JSON.stringify(this.events));
      console.log("Events stored");
    } catch (error) {
      console.log("Error storing events: " + error);
    }

    try {
      await AsyncStorage.setItem("news", JSON.stringify(this.news));
      console.log("News stored");
    } catch (error) {
      console.log("Error storing news: " + error);
    }
    try {
      if (this.starship !== undefined) {
        await AsyncStorage.setItem("starship", JSON.stringify(this.starship));
        console.log("Starship stored");
      }
    } catch (e) {
      console.log("Error Storing starship: " + e);
    }
    try {
      if (this.iss !== undefined) {
        await AsyncStorage.setItem("iss", JSON.stringify(this.iss));
        console.log("ISS stored");
      }
    } catch (e) {
      console.log("Error Storing ISS: " + e);
    }
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
  //#region PINNED FUNCTIONS
  async getPinnedLaunches() {
    let pinned = [];
    for (let i = 0; i < this.launches.upcoming.length; i++) {
      if (
        this.pinned.includes(this.launches.upcoming[i].id) &&
        !pinned.includes(this.launches.upcoming[i])
      ) {
        pinned.push(this.launches.upcoming[i]);
      }
    }
    for (let i = 0; i < this.launches.previous.length; i++) {
      if (
        this.pinned.includes(this.launches.previous[i].id) &&
        !pinned.includes(this.launches.previous[i])
      ) {
        pinned.push(this.launches.previous[i]);
      }
    }
    return pinned;
  }

  // Pinned Functions
  addPinned(launchInfo) {
    this.pinned.push(launchInfo);
  }
  removePinned(launchInfo) {
    let index = this.pinned.indexOf(launchInfo);
    if (index > -1) {
      this.pinned.splice(index, 1);
    }
  }
  togglePinned(launchInfo) {
    if (this.pinned.includes(launchInfo)) {
      this.removePinned(launchInfo);
      return false;
    } else {
      this.addPinned(launchInfo);
      return true;
    }
  }
  getPinned() {
    return this.pinned;
  }

  //#endregion

  //#region NOTIFICATION FUNCTIONS
  async scheduleNotifications() {
    console.log("Notifications enabled:", this.settings.enablenotifs);

    console.log("Cancelling Notifications");
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.log("Error cancelling notifications: " + error);
    }

    // Don't schedule notifications if notifications are disabled
    if (!this.settings.enablenotifs) {
      return;
    }

    console.log("Scheduling Notifications");
    let notifs = 0;
    // Load notifications for launches & events within the next 2 weeks
    // Loop through launches
    for (let i = 0; i < this.launches.upcoming.length; i++) {
      let launch = this.launches.upcoming[i];
      let launchTime = new Date(launch.net);
      let today = new Date();
      let preciseMinute = launch.net_precision.name == "Minute";
      let preciseHour = launch.net_precision.name == "Hour";
      let preciseDay = launch.net_precision.name == "Day";
      let preciseMonth = launch.net_precision.name == "Month";

      let timeDiff = launchTime.getTime() - today.getTime();

      // Check if launch is before today
      if (timeDiff < 0) {
        // Skip
        continue;
      }

      // Check if launch is within 2 weeks
      if (timeDiff > 1000 * 60 * 60 * 24 * 14) {
        // Skip
        continue;
      }

      // ignore if precise month
      if (preciseMonth) {
        continue;
      }

      // Schedule 24 hour
      if (this.settings.notif24hbefore && timeDiff > 1000 * 60 * 60 * 24) {
        notifs += 1;
        schedulePushNotification(
          launch.mission.name + " Launch Tomorrow",
          launch.rocket.configuration.full_name +
            " launch scheduled tomorrow at " +
            launchTime.toLocaleTimeString([], {
              hour: "2-digit",
            }),
          new Date(launchTime.getTime() - 1000 * 60 * 60 * 24)
        );
      }

      // If not precise, skip next notifications
      if (preciseDay) {
        continue;
      }

      // Schedule 1 hour
      if (this.settings.notif1hbefore) {
        notifs += 1;
        schedulePushNotification(
          launch.mission.name + " Launch in 1 Hour",
          launch.rocket.configuration.full_name +
            " launch scheduled at " +
            launchTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }) +
            (launch.launch_pad != null
              ? " from " + launch.launch_pad.location.name
              : ""),
          new Date(launchTime.getTime() - 1000 * 60 * 60)
        );
      }

      // If not precise, skip next notifications
      if (preciseHour) {
        continue;
      }

      // Schedule 10 minutes
      if (this.settings.notif10mbefore) {
        notifs += 1;
        schedulePushNotification(
          launch.mission.name + " Launch in 10 Minutes",
          launch.rocket.configuration.full_name + " launching now!",
          new Date(launchTime.getTime() - 1000 * 60 * 10)
        );
      }
    }

    console.log("Scheduled " + notifs + " Launch Notifications");
    // Loop through events
    for (let i = 0; i < this.events.upcoming.length; i++) {
      let event = this.events.upcoming[i];
      let eventTime = new Date(event.date);
      let today = new Date();

      if (event.date_precision == null) {
        continue;
      }

      let preciseMinute = event.date_precision.name == "Minute";
      let preciseHour = event.date_precision.name == "Hour";
      let preciseDay = event.date_precision.name == "Day";
      let preciseMonth = event.date_precision.name == "Month";

      let timeDiff = eventTime.getTime() - today.getTime();

      // Check if launch is before today
      if (timeDiff < 1) {
        // Skip
        continue;
      }

      // Check if launch is within 2 weeks
      if (timeDiff > 1000 * 60 * 60 * 24 * 14) {
        // Skip
        continue;
      }

      // ignore if precise month
      if (preciseMonth) {
        continue;
      }

      // Schedule 24 hour
      if (this.settings.notifevent24hbefore && timeDiff > 1000 * 60 * 60 * 24) {
        schedulePushNotification(
          event.name + " Launch Tomorrow",
          "Launch in 24 hours",
          new Date(eventTime.getTime() - 1000 * 60 * 60 * 24)
        );
      }

      // If not precise, skip next notifications
      if (preciseDay) {
        continue;
      }

      // Schedule 1 hour
      if (this.settings.notifevent1hbefore) {
        schedulePushNotification(
          event.name + " Launch in 1 Hour",
          "Launch in 1 hour",
          new Date(eventTime.getTime() - 1000 * 60 * 60)
        );
      }

      // If not precise, skip next notifications
      if (preciseHour) {
        continue;
      }

      // Schedule 10 minutes
      if (this.settings.notifevent10mbefore) {
        schedulePushNotification(
          event.name + " Launch in 10 Minutes",
          "Launching Soon!",
          new Date(eventTime.getTime() - 1000 * 60 * 10)
        );
      }
    }

    console.log("Scheduled Event Notifications");

    // Set notification for 3 days away for news
    schedulePushNotification(
      "New Spaceflight Articles",
      "Keep up to date with recent space news",
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
    );
    // Set notification for 5 days away for rockets and events
    schedulePushNotification(
      "Check out upcoming launches and events",
      "Stay on top of the latest spaceflight events",
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 5)
    );
    // Set notification for 5 days away for rockets and events
    schedulePushNotification(
      "Are you ready for the next launch?",
      "Check out launches and events happening soon",
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    );
    // Set notification for 5 days away for rockets and events
    schedulePushNotification(
      "Are you still there?",
      "H…hey! Just checking in… you haven’t opened me in a while. But it’s not like I want you to or anything!",
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
    );
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
  //#region STARSHIP DATA
  updateStarshipLaunchesAndEvents() {}
  //#endregion

  // #region PRIVATE DATA FUNCTIONS
  #getData() {
    data = {
      foryou: [],
      pinned: [],
      dashboardHighlights: [],
      dashboardFiltered: [],
      dashboardRecent: [],
      upcoming: [],
      previous: [],
      events: [],
      news: [],
    };

    data.upcoming = this.#getUpcomingLaunches();
    data.previous = this.#getPreviousLaunches();
    // data.pinned = this.getPinnedLaunches();

    data.dashboardHighlights = this.#getDashboardHighlightLaunches();
    data.dashboardFiltered = this.#getDashboardFilteredLaunches();
    data.dashboardRecent = this.#getDashboardRecentLaunches();
    data.dashboardEvents = this.#getDashboardEvents();
    data.dashboardNews = this.#getDashboardNews();

    data.foryou = this.#getForYouData();

    data.news = this.#getNewsData();
    data.events = this.#getEventsData();
    data.eventsHighlights = this.#getEventsDataHighlights();
    data.newsHighlights = this.#getNewsDataHighlights();
    return data;
  }

  #getUpcomingLaunches() {
    return this.launches.upcoming;
  }
  #getPreviousLaunches() {
    return this.launches.previous;
  }
  #getNewsData() {
    return this.news;
  }
  #getNewsDataHighlights() {
    return this.news.slice(0, 5);
  }
  #getEventsData() {
    return this.events;
  }
  #getEventsDataHighlights() {
    return this.events.upcoming.slice(0, 2);
  }

  // FOR YOU ALGORITHM
  #getForYouData() {
    const now = new Date().getTime();

    let recentLaunches = [];
    let recentEvents = [];
    let recent = [];
    // First, get recently launched launches within the last 7 days
    for (let i = 0; i < this.launches.previous.length; i++) {
      let launch = this.launches.previous[i];
      let launchTime = new Date(launch.net).getTime();
      if (now - launchTime < 1000 * 60 * 60 * 24 * 7) {
        recentLaunches.push(launch);
      }
    }
    for (let i = 0; i < this.events.previous.length; i++) {
      let event = this.events.previous[i];
      let time = new Date(event.date).getTime();
      if (now - time < 1000 * 60 * 60 * 24 * 7) {
        recentEvents.push(event);
      }
    }

    // Launch index and event index
    let ei = 0;
    let li = 0;

    // Check settings
    if (!this.settings.fyshowpastlaunches) {
      recentLaunches = [];
    }
    if (!this.settings.fyshowpastevents) {
      recentEvents = [];
    }
    while (ei < recentEvents.length || li < recentLaunches.length) {
      let einrange = ei < recentEvents.length;
      let linrange = li < recentLaunches.length;

      if (!einrange && !linrange) {
        break;
      }
      // If out of events
      else if (!einrange) {
        recent.push(recentLaunches[li]);
        li++;
        continue;
      }
      // If out of launches
      else if (!linrange) {
        recent.push(recentEvents[ei]);
        ei++;
        continue;
      }

      // Compare time of event and launch
      let eventTime = new Date(recentEvents[ei].date).getTime();
      let launchTime = new Date(recentLaunches[li].net).getTime();

      // Add whichever is closer
      if (eventTime >= launchTime) {
        recent.push(recentEvents[ei]);
        ei++;
      } else {
        recent.push(recentLaunches[li]);
        li++;
      }
    }

    // Intended behaviour:
    // Return launch or event that is closest to current date
    // But only if the event/launch has a date_precision of day or better
    // Otherwise return the next launch/event that has a date_precision of day or better
    // If no launches with date_precision of day or better, return one with date_precision of month
    // If no event with date_precision of month, return one with date_precision of month

    // Launch index and event index
    ei = 0;
    li = 0;
    // Other info
    let launches = this.launches.upcoming;
    let data = [];

    while (
      ei < this.events.upcoming.length ||
      li < this.launches.upcoming.length
    ) {
      let einrange = ei < this.events.upcoming.length;
      let linrange = li < this.launches.upcoming.length;

      if (!einrange && !linrange) {
        break;
      }
      // If out of events, and launches are still accurate
      else if (!einrange && launches[li].net_precision.name != "Month") {
        data.push(this.launches.upcoming[li]);
        li++;
        continue;
      }
      // If out of launches, and events are still accurate
      else if (
        !linrange &&
        this.events.upcoming[ei].date_precision != null &&
        this.events.upcoming[ei].date_precision.name != "Month"
      ) {
        data.push(this.events.upcoming[ei]);
        ei++;
        continue;
      }
      // If out of launches, and events are not accurate
      else if (!linrange) {
        // Stop
        break;
      }
      // If we still have events and launches, but launches are not accurate
      else if (launches[li].net_precision.name == "Month") {
        // Stop
        // data.push(this.launches.upcoming[li]);
        li = this.launches.upcoming.length + 1;
        continue;
      }
      let eventTime = new Date(this.events.upcoming[ei].date).getTime();
      let launchTime = new Date(this.launches.upcoming[li].net).getTime();

      let eventHasPrecision =
        this.events.upcoming[ei].date_precision != null &&
        this.events.upcoming[ei].date_precision.name != "Month";

      // Add whichever is closer, as long as the event has precision
      if (eventTime <= launchTime && eventHasPrecision) {
        data.push(this.events.upcoming[ei]);
        ei++;
        continue;
      } else {
        data.push(this.launches.upcoming[li]);
        li++;
        continue;
      }
    }

    // loop through and remove duplicates
    data = [...data, ...recent];
    let unique = [];
    let uniqueIds = [];
    for (let i = 0; i < data.length; i++) {
      if (!uniqueIds.includes(data[i].id)) {
        unique.push(data[i]);
        uniqueIds.push(data[i].id);
      }
    }

    return unique;
  }

  // FOR DASHBOARD
  #getDashboardHighlightLaunches() {
    return [this.launches.upcoming[0]];
  }
  // Return last 3 recently launched
  // #TODO Change to return recently launched from last week?
  #getDashboardRecentLaunches() {
    return this.launches.previous.slice(0, 3);
  }

  #getDashboardFilteredLaunches() {
    // return this.launches.upcoming.slice(0, 5);
    // Filter the launches based on the tags
    // Cutoff at launches that are more than 1 month away
    return this.launches.upcoming.slice(1, 5);
  }
  #getDashboardEvents() {
    return this.events.upcoming.slice(0, 1);
  }
  #getDashboardNews() {
    return this.news.slice(0, 2);
  }

  //#endregion

  //#region DATA FETCHING FUNCTIONS
  // Data fetching functions
  async getUpcomingData() {
    this.apiCallTimes += 1;
    console.log("Getting Upcoming, API Calls: " + this.apiCallTimes);

    return await this.APIHandler.getUpcomingLaunches().then((data) => {
      data.lastCalledTime = new Date().getTime();
      // TODO - Store data in local storage
      // TODO - Instead of overwriting the data, merge the new data with the old data
      if (this.launches === undefined) this.launches = {};
      if (this.launches.upcoming === undefined) this.launches.upcoming = [];

      this.launches.upcoming = data;

      return this.launches;
    });
  }

  async getPreviousData() {
    this.apiCallTimes += 1;
    console.log("Getting Previous, API Calls: " + this.apiCallTimes);

    return await this.APIHandler.getPreviousLaunches().then((data) => {
      if (this.launches === undefined) this.launches = {};
      if (this.launches.previous === undefined) this.launches.previous = [];

      this.launches.previous = data;

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
