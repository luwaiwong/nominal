import * as SDApi from "./SpaceDevsAPIHandler";

export default class UserData {
  constructor() {
    this.name = "User Data";
    this.launchdata = Object;
    this.APIHandler = SDApi;
  }

  // PUBLIC METHODS
  async getUpcomingLaunches() {
    // Check if data has been fetched
    if (this.launchdata.results > 0) {
      // If data has been fetched, return the top 10 upcoming launches
      return this.#getStuffUpcomingLaunches();
    }

    // DATA HAS NOT BEEN FETCHED

    // Fetch the data and return the top 10 upcoming launches
    return await this.getData().then((data) => {
      return this.#getStuffUpcomingLaunches();
    });
  }

  // PRIVATE METHODS FOR SORTING DATA
  #getStuffUpcomingLaunches() {
    let curTime = new Date().getTime();
    console.log(this.launchdata.lastCalledTime - curTime);
    return this.launchdata.results.slice(0, 10);
  }

  async getData() {
    return await this.APIHandler.getUpcomingLaunches().then((data) => {
      data.lastCalledTime = new Date().getTime();
      this.launchdata = data;

      return data;
    });
  }
}
