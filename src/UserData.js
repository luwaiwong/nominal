import * as APIHandler from "./APIHandler";

export default class UserData {
  constructor() {
    this.launchdata = Object;
  }

  // PUBLIC METHODS
  async getUpcomingLaunches() {
    // Check if data has been fetched
    if (this.launchdata.results > 0) {
      // If data has been fetched, return the top 10 upcoming launches
      return this.#getUpcomingLaunches();
    }

    // DATA HAS NOT BEEN FETCHED

    // Fetch the data and return the top 10 upcoming launches
    return await this.getData().then((data) => {
      return this.#getUpcomingLaunches();
    });
  }

  // PRIVATE METHODS FOR SORTING DATA
  #getUpcomingLaunches() {
    let curTime = new Date().getTime();
    console.log(this.launchdata.lastCalledTime - curTime);
    return this.launchdata.results.slice(0, 10);
  }

  async getData() {
    return await APIHandler.getUpcomingLaunches().then((data) => {
      data.lastCalledTime = new Date().getTime();
      this.launchdata = data;

      return data;
    });
  }
}
