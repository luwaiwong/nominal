import * as SDApi from "./SpaceDevsAPIHandler";

export default class UserData {
  constructor() {
    this.name = "User Data";
    this.launchdata = Object;
    this.APIHandler = SDApi;
    this.pinned = [];
  }

  // PUBLIC METHODS
  async getUpcomingLaunches() {
    // Check if data has been fetched
    if (this.launchdata > 0) {
      // If data has been fetched, return the top 10 upcoming launches
      return this.#getUpcomingLaunches();
    }

    // DATA HAS NOT BEEN FETCHED

    // Fetch the data and return the top 10 upcoming launches
    return await this.getData().then((data) => {
      return this.#getUpcomingLaunches();
    });
  }

  async getLaunch(id) {}
  async getLaunchProvider(id) {}
  async getLaunchVehicle(id) {}

  addPinned(launchInfo) {
    console.log(this.pinned);
    this.pinned.push(launchInfo);
  }
  removePinned(launchInfo) {
    let index = this.pinned.indexOf(launchInfo);
    if (index > -1) {
      this.pinned.splice(index, 1);
    }
  }
  togglePinned(launchInfo) {
    console.log(this.pinned);
    if (this.pinned.includes(launchInfo)) {
      this.removePinned(launchInfo);
      return false;
    } else {
      this.addPinned(launchInfo);
      return true;
    }
  }

  // PRIVATE METHODS FOR SORTING DATA
  #getUpcomingLaunches() {
    let curTime = new Date().getTime();
    console.log(this.launchdata.lastCalledTime - curTime);
    return this.launchdata.slice(0, 10);
  }

  #getLaunchProviders() {}

  async getData() {
    return await this.APIHandler.getUpcomingLaunches().then((data) => {
      data.lastCalledTime = new Date().getTime();
      // TODO - Store data in local storage
      // TODO - Instead of overwriting the data, merge the new data with the old data
      this.launchdata = data;
      console.log(data);
      return data;
    });
  }

  getPinned() {
    return this.pinned;
  }
}
