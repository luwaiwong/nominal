import * as APIHandler from './APIHandler';

export async function getUpcomingLaunches(){
    let data = await APIHandler.getUpcomingLaunches();
    console.log(data);
    return data.toString();
}