const LAUNCH_DEV_API_URL = "https://lldev.thespacedevs.com/2.2.0/";
const LAUNCH_PROD_API_URL = "https://ll.thespacedevs.com/2.2.0/";
const LAUNCH_API_URL = LAUNCH_PROD_API_URL;

const NEWS_API_URL = "https://api.spaceflightnewsapi.net/v4/";

export async function fetchLaunches(type: string, limit: number, offset: number){
    return await fetch(LAUNCH_API_URL+"launch/"+type+"/?limit="+limit+"&offset="+offset+"&hide_recent_previous=true")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        return processLaunchData(data.results);
    })
    .catch((error) => {
        console.log("Error fetching launch data:", error);
        return {}
    })

}
export async function getUpcomingLaunches(){
    return await fetch(LAUNCH_API_URL+"launch/upcoming/?hide_recent_previous=true")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        return processLaunchData(data.results);
    })
}

export async function getPreviousLaunches(){

    return await fetch(LAUNCH_API_URL+"launch/previous/")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        return processLaunchData(data.results);
    })
}

export async function getNews(){
    
    return await fetch(NEWS_API_URL+"articles")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        return data;
    })
    .catch((error) => {
        console.log("Error fetching news data:", error);
        return {}
    })
}

export async function getEvents(){
    return await fetch(LAUNCH_API_URL+"event/upcoming")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        return data;
    })

}

export async function getPreviousEvents(){
    return await fetch(LAUNCH_API_URL+"event/previous")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        return data;
    })

}

export async function getRocketFamilies(){
    return await fetch(LAUNCH_API_URL+"launcher/")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        return data;
    })
}

export async function fetchStarshipDashboard(){
    return await fetch(LAUNCH_API_URL+"dashboard/starship/")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        data.upcoming.launches = processLaunchData(data.upcoming.launches);
        data.previous.launches = processLaunchData(data.previous.launches);
        return data;
    }).catch((error) => {
        console.log("Error fetching starship data:", error);
        return {}
    })
}

export async function fetchISSData(){
    return await fetch(LAUNCH_API_URL+"spacestation/4/")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        return data;
    })
}

export function processLaunchData(data: any){
    try {
    let processedData = data.map((launch: any) => {
        return {
            // Dashboard Launch Data
            // Launch Info
            type: "launch",
            id: launch.id,
            sd_id: launch.id,
            name: launch.name,
            image: launch.image,

            // Provider and Location
            rocket: launch.rocket,
            launch_provider: launch.launch_service_provider,
            launch_pad: launch.pad,
            mission: launch.mission,

            // Launch Time
            net: launch.net,
            net_precision: launch.net_precision,
            date: launch.net,
            date_precision: launch.net_precision,
            window_start: launch.window_start,
            window_end: launch.window_end,

            // Status
            status: launch.status,
            holdreason: launch.holdreason,
            failreason: launch.failreason,

            // Links & Media
            webcast_live: launch.webcast_live,
            infographic: launch.infographic,

            // Other information
            program: launch.program,
        }
    })
    return processedData;
    } catch (error){
        console.log("Error processing launch data:", error);
        return null
    }
}
export function processIndividualLaunchData(launch: any){
    try {
        return {
            // Dashboard Launch Data
            // Launch Info
            type: "launch",
            id: launch.id,
            sd_id: launch.id,
            name: launch.name,
            image: launch.image,

            // Provider and Location
            rocket: launch.rocket,
            launch_provider: launch.launch_service_provider,
            launch_pad: launch.pad,
            mission: launch.mission,

            // Launch Time
            net: launch.net,
            net_precision: launch.net_precision,
            window_start: launch.window_start,
            window_end: launch.window_end,

            // Status
            status: launch.status,
            holdreason: launch.holdreason,
            failreason: launch.failreason,

            // Links & Media
            webcast_live: launch.webcast_live,
            infographic: launch.infographic,

            // Other information
            program: launch.program,
        }
    } catch (error){
        console.log("Error processing launch data:", error);
        return null
    }
}

function convertTime(time: string){
    let date = new Date(time);
    return date.toLocaleString();
}
