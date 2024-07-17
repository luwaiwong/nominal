import React from "react";
import * as APIHandler from "./APIHandler";
import Tags from "./Tags";

import AsyncStorage from "@react-native-async-storage/async-storage";

const twentyfivemin = 1000 * 60 * 25;
const twomin = 1000 * 60 * 2;

export const UserContext = React.createContext(null);

export function createUserContext() {
  let context = new UserData();
  return context;
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
    this.lastCall = undefined;
    this.cache = undefined;
    this.nav = undefined;

    this.settings = {
      enablenofifs: true,
      // FOR YOU SETTINGS
      fyshowpastlaunches: true,
      fyshowpastevents: true,
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

    this.clearData();
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
    // Check cache for data
    try {
      const lastCall = await AsyncStorage.getItem("lastcall");
      const launches = await AsyncStorage.getItem("launches");
      const events = await AsyncStorage.getItem("events");
      const news = await AsyncStorage.getItem("news");

      let hasData =
        lastCall !== null &&
        launches !== null &&
        events !== null &&
        news !== null;

      // Log the last call time
      if (hasData) {
        console.log(
          "Cache Time: " +
            (new Date().getTime() - parseInt(lastCall)) / 1000 +
            "s ago"
        );
      } else {
        console.log("No cache or incomplete cache found");
      }

      // Check if data is outdated, if not then use cache
      if (
        hasData &&
        new Date().getTime() - parseInt(lastCall) < twentyfivemin
      ) {
        this.launchdata = JSON.parse(launches);
        this.events = JSON.parse(events);
        this.news = JSON.parse(news);
        console.log("Data fetched from cache");

        return this.#getData();
      }

      // Record cache for further use
      this.cache = {
        lastCall: lastCall,
        launches: launches,
        events: events,
        news: news,
      };
    } catch (error) {
      console.log("Error getting data from cache: " + error);
    }

    // Fetch the data and return the upcoming launches
    // Get current time
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
      this.lastCall = new Date().getTime();

      // Calls the storedata function after returning the data
      setTimeout.bind(this, this.storeData(), 0);
      return this.#getData();
    } catch (error) {
      console.log("Error getting data: " + error);
      console.log("Returning cached data");
      this.launchdata = JSON.parse(this.cache.launches);
      this.events = JSON.parse(this.cache.events);
      this.news = JSON.parse(this.cache.news);
      return this.#getData();
    }
  }

  // Stores the data in local storage
  async storeData() {
    try {
      await AsyncStorage.setItem("lastcall", this.lastCall.toString());
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
    const launches = this.launchdata.upcoming;
    const data = [];

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

    return [...data, ...recent];
  }

  // FOR DASHBOARD
  #getDashboardHighlightLaunches() {
    return [this.launchdata.upcoming[0]];
  }
  // Return last 3 recently launched
  // #TODO Change to return recently launched from last week?
  #getDashboardRecentLaunches() {
    return this.launchdata.previous.slice(0, 5);
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
