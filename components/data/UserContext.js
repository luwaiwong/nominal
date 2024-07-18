import React from "react";
import * as APIHandler from "./APIHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import Tags from "./Tags";

const twentyfivemin = 1000 * 60 * 25;
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
    this.launchdata = undefined;
    this.news = undefined;
    this.events = undefined;
    this.APIHandler = APIHandler;
    this.systemTags = Tags;
    this.navigator = undefined;
    this.lastcall = 0;
    this.cache = undefined;
    this.nav = undefined;
    this.gettingdata = false;
    this.notifs = [];

    this.settings = {
      // Notifications
      enablenotifs: true,
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
  async clearData() {
    try {
      await AsyncStorage.removeItem("lastcall");
      await AsyncStorage.removeItem("launches");
      await AsyncStorage.removeItem("events");
      await AsyncStorage.removeItem("news");
      console.log("Data Cleared");
    } catch (error) {
      console.log("Error clearing data: " + error);
    }
  }

  // Returns all required data
  async getData() {
    // Check scheduled notifications

    if (this.gettingdata) {
      return null;
    }

    this.gettingdata = true;

    // Check cache for data
    try {
      const lastcall = await AsyncStorage.getItem("lastcall");
      const launches = await AsyncStorage.getItem("launches");
      const events = await AsyncStorage.getItem("events");
      const news = await AsyncStorage.getItem("news");

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
      if (
        hasData &&
        new Date().getTime() - parseInt(lastcall) < twentyfivemin
      ) {
        this.launchdata = JSON.parse(launches);
        this.events = JSON.parse(events);
        this.news = JSON.parse(news);
        console.log("Data fetched from cache");

        this.gettingdata = false;
        return this.#getData();
      }

      // Otherwise record cache for further use if unable to pull data
      this.cache = {
        launches: launches,
        events: events,
        news: news,
      };
    } catch (error) {
      console.log("Error getting data from cache: " + error);
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

      // Calls the storedata function after returning the data
      setTimeout.bind(this, this.storeData(), 0);
      setTimeout.bind(this, this.scheduleNotifications(), 0);

      this.gettingdata = false;
      return this.#getData();
    } catch (error) {
      // If unable to pull data
      console.log("Error getting data: " + error);
      console.log("Returning cached data");
      this.launchdata = JSON.parse(this.cache.launches);
      this.events = JSON.parse(this.cache.events);
      this.news = JSON.parse(this.cache.news);

      this.gettingdata = false;
      return this.#getData();
    }
  }

  async forceFetchData() {
    // if last fetch < 10 minutes ago, return cache
    // if (new Date().getTime() - this.lastcall < 1000 * 60 * 10) {
    //   console.log("Last fetch < 10 minutes ago, returning cache");
    //   return this.#getData();
    // }
    console.log("Forcing Data Fetch");

    // Try fetching the data and return the upcoming launches

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

    // Calls the storedata function after returning the data
    setTimeout.bind(this, this.storeData(), 0);
    setTimeout.bind(this, this.scheduleNotifications(), 0);

    this.gettingdata = false;
    return this.#getData();
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
      await AsyncStorage.setItem("launches", JSON.stringify(this.launchdata));
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
    for (let i = 0; i < this.launchdata.upcoming.length; i++) {
      if (
        this.pinned.includes(this.launchdata.upcoming[i].id) &&
        !pinned.includes(this.launchdata.upcoming[i])
      ) {
        pinned.push(this.launchdata.upcoming[i]);
      }
    }
    for (let i = 0; i < this.launchdata.previous.length; i++) {
      if (
        this.pinned.includes(this.launchdata.previous[i].id) &&
        !pinned.includes(this.launchdata.previous[i])
      ) {
        pinned.push(this.launchdata.previous[i]);
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
    for (let i = 0; i < this.launchdata.upcoming.length; i++) {
      let launch = this.launchdata.upcoming[i];
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
      if (
        this.settings.notiflaunch24hbefore &&
        timeDiff > 1000 * 60 * 60 * 24
      ) {
        notifs += 1;
        schedulePushNotification(
          launch.mission.name + " Launch Tomorrow",
          "Launch in 24 hours",
          new Date(launchTime.getTime() - 1000 * 60 * 60 * 24)
        );
      }

      // If not precise, skip next notifications
      if (preciseDay) {
        continue;
      }

      // Schedule 1 hour
      if (this.settings.notiflaunch1hbefore) {
        notifs += 1;
        schedulePushNotification(
          launch.mission.name + " Launch in 1 Hour",
          "Launch in 1 hour",
          new Date(launchTime.getTime() - 1000 * 60 * 60)
        );
      }

      // If not precise, skip next notifications
      if (preciseHour) {
        continue;
      }

      // Schedule 10 minutes
      if (this.settings.notiflaunch10mbefore) {
        notifs += 1;
        schedulePushNotification(
          launch.mission.name + " Launch in 10 Minutes",
          "Launching Soon!",
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
    return this.launchdata.upcoming;
  }
  #getPreviousLaunches() {
    return this.launchdata.previous;
  }
  #getNewsData() {
    return this.news;
  }
  #getNewsDataHighlights() {
    return this.news.slice(0, 5);
  }
  #getEventsData() {
    return this.events.upcoming;
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
    for (let i = 0; i < this.launchdata.previous.length; i++) {
      let launch = this.launchdata.previous[i];
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
    let launches = this.launchdata.upcoming;
    let data = [];

    while (
      ei < this.events.upcoming.length ||
      li < this.launchdata.upcoming.length
    ) {
      let einrange = ei < this.events.upcoming.length;
      let linrange = li < this.launchdata.upcoming.length;

      if (!einrange && !linrange) {
        break;
      }
      // If out of events, and launches are still accurate
      else if (!einrange && launches[li].net_precision.name != "Month") {
        data.push(this.launchdata.upcoming[li]);
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
        // data.push(this.launchdata.upcoming[li]);
        li = this.launchdata.upcoming.length + 1;
        continue;
      }
      let eventTime = new Date(this.events.upcoming[ei].date).getTime();
      let launchTime = new Date(this.launchdata.upcoming[li].net).getTime();

      let eventHasPrecision =
        this.events.upcoming[ei].date_precision != null &&
        this.events.upcoming[ei].date_precision.name != "Month";

      // Add whichever is closer, as long as the event has precision
      if (eventTime <= launchTime && eventHasPrecision) {
        data.push(this.events.upcoming[ei]);
        ei++;
        continue;
      } else {
        data.push(this.launchdata.upcoming[li]);
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
    return [this.launchdata.upcoming[0]];
  }
  // Return last 3 recently launched
  // #TODO Change to return recently launched from last week?
  #getDashboardRecentLaunches() {
    return this.launchdata.previous.slice(0, 3);
  }

  #getDashboardFilteredLaunches() {
    // return this.launchdata.upcoming.slice(0, 5);
    // Filter the launches based on the tags
    // Cutoff at launches that are more than 1 month away
    return this.launchdata.upcoming.slice(1, 3);
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
      if (this.launchdata === undefined) this.launchdata = {};
      if (this.launchdata.upcoming === undefined) this.launchdata.upcoming = [];

      this.launchdata.upcoming = data;

      return this.launchdata;
    });
  }

  async getPreviousData() {
    this.apiCallTimes += 1;
    console.log("Getting Previous, API Calls: " + this.apiCallTimes);

    return await this.APIHandler.getPreviousLaunches().then((data) => {
      if (this.launchdata === undefined) this.launchdata = {};
      if (this.launchdata.previous === undefined) this.launchdata.previous = [];

      this.launchdata.previous = data;

      return this.launchdata;
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

  //#endregion
}
