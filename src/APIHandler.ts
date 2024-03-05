const API_URL = "https://lldev.thespacedevs.com/2.2.0/";


export async function getUpcomingLaunches(){

    return await fetch(API_URL+"launch/upcoming/")
    .then((response) => {
        console.log("Getting Response");
        return response.json();
    })
    .then((data) => {
        console.log("Response Recieved");
        return data;
    })
}