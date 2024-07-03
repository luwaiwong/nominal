import * as APIHandler from "./APIHandler";
import Tags from "./Tags";

export default class UserData {
  constructor() {
    // INFO
    this.name = "User Data";
    this.launchdata = undefined;
    this.news = undefined;
    this.events = undefined;
    this.APIHandler = APIHandler;
    this.systemTags = Tags;

    // USER DATA
    this.pinned = [];
    this.tags = {
      launchProviders: [],
    };

    // FRONTEND STATE
    this.immersive = false;

    this.apiCallTimes = 0;
    console.log("Creating User Data");
  }

  // PUBLIC METHODS
  // Data Functions
  // Returns all required data
  async getData() {
    // Check if data has been fetched
    if (this.launchdata !== undefined) {
      // If data has been fetched, return the top 10 upcoming launches
      return this.#getData();
    }

    // Fetch the data and return the upcoming launches
    // Get current time
    let curTime = new Date().getTime();
    return await this.getUpcomingData().then((data) => {
      return this.getPreviousData().then((data) => {
        return this.getEvents().then((data) => {
          return this.getNews().then((data) => {
            console.log("Data Fetched");
            // How long did it take to fetch data?
            let fetchTime = new Date().getTime() - curTime;
            console.log("Data Fetch Time: " + fetchTime + "ms");
            return this.#getData();
          });
        });
      });
    });
  }
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

  // Tags Functions
  getTags() {
    return this.tags;
  }
  setTags() {}
  getSystemTags() {
    return this.systemTags;
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

  // PRIVATE METHODS FOR SORTING DATA
  // Returns all data used in app
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
    data.pinned = this.getPinnedLaunches();

    data.dashboardHighlights = this.#getDashboardHighlightLaunches();
    data.dashboardFiltered = this.#getDashboardFilteredLaunches();
    data.dashboardRecent = this.#getDashboardRecentLaunches();
    data.dashboardEvents = this.#getDashboardEvents();
    data.dashboardNews = this.#getDashboardNews();

    data.foryou = this.#getForYouData();

    data.news = this.#getNewsData();
    data.events = this.#getEventsData();
    data.eventsHighlights = this.#getEventsDataHighlights();
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
    return this.news.slice(0, 4);
  }
  #getEventsData() {
    return this.events;
  }
  #getEventsDataHighlights() {
    return this.events.slice(0, 2);
  }

  // FOR YOU ALGORITHM
  #getForYouData() {
    return this.launchdata.upcoming;
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
    // Cutoff at launches that are more than 1 week away
    let curTime = new Date().getTime();
    let cutoffTime = curTime + 604800000;
    let launches = [];

    for (let i = 1; i < this.launchdata.upcoming.length; i++) {
      let launch = this.launchdata.upcoming[i];

      // Check if the launch is within the cutoff time
      let launchTime = new Date(launch.net).getTime();
      if (launchTime > cutoffTime) {
        continue;
      }

      // Check if the launch is pinned
      if (this.pinned.includes(launch.id)) {
        continue;
      }

      // Check if the launch fufills the tags
      if (this.tags.launchProviders.length > 0) {
        if (!this.tags.launchProviders.includes(launch.launch_provider.name)) {
          continue;
        }
      }

      launches.push(launch);
    }

    if (launches.length > 2) {
      return launches.slice(1, 3);
    }
    return launches;
  }
  #getDashboardEvents() {
    return this.events.slice(0, 1);
  }
  #getDashboardNews() {
    return this.news.slice(0, 2);
  }

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
        this.events = data.results;
        return this.events;
      })
      .catch((error) => {
        console.log("Error getting events: " + error);
      });
  }
}
