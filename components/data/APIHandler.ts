const LAUNCH_DEV_API_URL = "https://lldev.thespacedevs.com/2.2.0/";
const LAUNCH_PROD_API_URL = "https://ll.thespacedevs.com/2.2.0/";
const LAUNCH_API_URL = LAUNCH_DEV_API_URL;

const NEWS_API_URL = "https://api.spaceflightnewsapi.net/v4/";

export async function getUpcomingLaunches(){
    return await fetch(LAUNCH_API_URL+"launch/upcoming/")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        // console.log("API Response Recieved, Upcoming Launches:",data);
        return processLaunchData(data.results);
    })
}

export async function getPreviousLaunches(){

    return await fetch(LAUNCH_API_URL+"launch/previous/")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        // console.log("API Response Recieved, Previous Launches:",data);
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


export async function getRocketFamilies(){
    return await fetch(LAUNCH_API_URL+"launcher/")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        return data;
    })
}

function processLaunchData(data: any){
    let processedData = data.map((launch: any) => {
        return {
            // Dashboard Launch Data
            // Launch Info
            type: "launch",
            id: launch.id,
            sd_id: launch.id,
            name: launch.name,
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
            image: launch.image,
        }
    });
    return processedData;
}

function convertTime(time: string){
    let date = new Date(time);
    return date.toLocaleString();
}
