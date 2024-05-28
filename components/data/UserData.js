import * as SDApi from "./SpaceDevsAPIHandler";
import Tags from "./Tags";

export default class UserData {
  constructor() {
    // INFO
    this.name = "User Data";
    this.launchdata = undefined;
    this.APIHandler = SDApi;
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
    return await this.getUpcomingData().then((data) => {
      return this.getPreviousData().then((data) => {
        return this.#getData();
      });
    });
  }

  async getDashboardFiltered() {
    // Check if data has been fetched
    if (
      this.launchdata !== undefined &&
      this.launchdata.upcoming !== undefined
    ) {
      // If data has been fetched, return the top 10 upcoming launches
      return this.#getDashboardFilteredLaunches();
    }

    // DATA HAS NOT BEEN FETCHED
    // Fetch the data and return the upcoming launches
    return await this.getUpcomingData().then((data) => {
      return this.#getDashboardFilteredLaunches();
    });
  }
  async getUpcomingLaunches() {
    // Check if data has been fetched
    if (
      this.launchdata !== undefined &&
      this.launchdata.upcoming !== undefined
    ) {
      // If data has been fetched, return the top 10 upcoming launches
      return this.#getUpcomingLaunches();
    }

    // DATA HAS NOT BEEN FETCHED
    // Fetch the data and return the upcoming launches
    return await this.getUpcomingData().then((data) => {
      return this.#getUpcomingLaunches();
    });
  }

  async getPreviousLaunches() {
    // Check if data has been fetched
    if (
      this.launchdata !== undefined &&
      this.launchdata.previous !== undefined
    ) {
      // If data has been fetched, return the top 10 upcoming launches
      return this.#getPreviousLaunches();
    }

    // DATA HAS NOT BEEN FETCHED
    // Fetch the data and return the previous 10 launches
    return await this.getPreviousData().then((data) => {
      return this.#getPreviousLaunches();
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
    };

    data.upcoming = this.#getUpcomingLaunches();
    data.previous = this.#getPreviousLaunches();
    data.pinned = this.getPinnedLaunches();
    data.dashboardHighlights = this.#getDashboardHighlightLaunches();
    data.dashboardFiltered = this.#getDashboardFilteredLaunches();
    data.dashboardRecent = this.#getDashboardRecentLaunches();
    data.foryou = this.#getForYouData();

    return data;
  }
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
    return this.launchdata.previous.slice(0, 3);
  }

  #getDashboardFilteredLaunches() {
    // Filter the launches based on the tags
    // Cutoff at launches that are more than 1 month away
    let curTime = new Date().getTime();
    let cutoffTime = curTime + 2628000000;
    let launches = [];

    for (let i = 0; i < this.launchdata.upcoming.length; i++) {
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
    return launches;
  }

  #getUpcomingLaunches() {
    return this.launchdata.upcoming;
  }
  #getPreviousLaunches() {
    return this.launchdata.previous;
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
}
