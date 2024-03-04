const API_URL = "https://lldev.thespacedevs.com/2.2.0/";


export async function getUpcomingLaunches(){

    fetch(API_URL+"launch/upcoming/")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        return data;
    })
}