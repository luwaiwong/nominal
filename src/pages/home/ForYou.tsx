import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Pressable, FlatList, Dimensions, StatusBar} from "react-native";
import {useRef, useEffect, useState, useContext } from "react";
import PagerView from "react-native-pager-view";

import { COLORS, FONT, TOP_BAR_HEIGHT } from "src/styles";
import Loading, { LoadingView } from "src/components/Loading";

import {ForYouLaunch, ForYouEvent, ForYouEnd, ForYouImageOfDay, ForYouNews} from "./components/ForYouItem";
import { useUserStore } from "src/utils/UserStore";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingLaunches } from "src/utils/APIHandler";


// OK I know this is not supposed to be shared, BUT anyone can get this key from the NASA API website
// and I don't really care... 
const NASA_API_KEY = "yIeGdYwNALets4ochBIhfAHIuiijMnaObY6leMA7";
const DEMO_KEY = "DEMO_KEY";

const APOD_API_KEY = NASA_API_KEY;

export default function ForYou(props) {
  const pagerRef = useRef(null);
  const curPage = useRef(0);
  
  const [items, setItems]=useState([])
  const upcomingLaunches = useUserStore((state)=>state.upcomingLaunches)
  const setUpcomingLaunches = useUserStore((state)=>state.setUpcomingLaunches)
  


  let imageOfDay = useRef(null);
  let timer = useRef(0);  
  let fetching = useRef(false);


  useEffect(()=>{
    setItems(upcomingLaunches)

  }, [upcomingLaunches])

  // timer to check if the user has not been in the For You page for a while
  // Constantly ticking 1 second timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Your code here...
      timer.current += 1;
      if (timer.current >= 90){
        timer.current = 0;
        setPage(0);
      }
    }, 1000); // 1000 milliseconds = 1 second

    // Clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // Specify empty array as second argument to run only when the component mounts and unmounts
  }, []);// Subscribe and check app state




  async function fetchIOD() {
    fetching.current = true;
    await fetch("https://api.nasa.gov/planetary/apod?api_key="+APOD_API_KEY)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
      if (data.url == null) {
        console.log("Error fetching image of the day", data)
      } else {

        if (data.media_type == "video"){
          return;
        }
        data.type = "image";
        imageOfDay.current = data;
      }
    }).catch((error) => {
        console.log("Error fetching image of the day:", error);
    })
    fetching.current = false;
  }

  // Sort items for the For You page
  // If there are recently launched launches, more recent than the next launch, show those recent launches
  // Next show upcoming launches and events
  // Then show the image of the day somewhere in the middle
  // Show latest news
  // And then show rest of recently launched
  // function sortForYouItems(){
  //   if (userContext == null || userContext.launches == null || userContext.events == null || userContext.launches.upcoming == null || userContext.launches.previous == null || userContext.events.upcoming == null || userContext.events.previous == null){
  //     return;
  //   }
  //   let items = []

  //   // Get most recent launches & events
  //   // Only allow items within 1 days, and with precision of 1 day or less
  //   let recentEvents = userContext.events.previous.filter((event) => {
  //     let date = new Date(event.date);
  //     let now = new Date();
  //     let diff = now.getTime() - date.getTime();
  //     let days = diff / (1000 * 3600 * 24);
  //     return days <= 7 && event.date_precision != "Month";
  //   })
  //   let recentLaunches = userStore.launches.previous.filter((launch) => {
  //     let date = new Date(launch.date);
  //     let now = new Date();
  //     let diff = now.getTime() - date.getTime();
  //     let days = diff / (1000 * 3600 * 24);
  //     return days <= 7 && launch.date_precision != "Month";
  //   })
    
  //   // Get upcoming launches & events
  //   // Allow items wtihin 7 days, and with precision of 1 day or less
  //   let upcomingEvents = userStore.events.upcoming.filter((event) => {
  //     let date = new Date(event.date);
  //     let now = new Date();
  //     let diff = date.getTime() - now.getTime();
  //     let days = diff / (1000 * 3600 * 24);
  //     // Ignore events that have already passed
  //     if (days < 0){
  //       return false
  //     }
  //     return days <= 7 && event.date_precision != "Month";
  //   })
  //   let upcomingLaunches = userStore.launches.upcoming.filter((launch) => {
  //     let date = new Date(launch.date);
  //     let now = new Date();
  //     let diff = date.getTime() - now.getTime();
  //     let days = diff / (1000 * 3600 * 24);
  //     return days <= 7 && launch.date_precision != "Month";
  //   })

  //   // Combine upcoming events and launches, and sort by date
  //   let upcoming = [...upcomingEvents, ...upcomingLaunches].sort((a,b) => {
  //     let dateA = new Date(a.date).getTime();
  //     let dateB = new Date(b.date).getTime();
  //     return dateA - dateB;
  //   })
    
  //   // combine previous events and launches, and sort by date
  //   let previous = [...recentEvents, ...recentLaunches].sort((a,b) => {
  //     let dateA = new Date(a.date).getTime();
  //     let dateB = new Date(b.date).getTime();
  //     return dateA - dateB;
  //   })
  //   previous.reverse();
    
  //   // Check if most recent in previous launches is more recent than the next launch
  //   // If so, add to the list
  //   let now = new Date().getTime();
  //   let nextDate = new Date(upcoming[0].date).getTime();
  //   for (let i = 0; i < recentLaunches.length; i++){
  //     let date = new Date(recentLaunches[i].date).getTime();
  //     if (Math.abs(date-now)<Math.abs(nextDate-now)){
  //       items.push(recentLaunches[i]);
        
  //       // Remove from previous
  //       let index = previous.indexOf(recentLaunches[i]);
  //       if (index > -1){
  //         previous.splice(index, 1);
  //       }

  //     }
  //   }

    

  //   items = [...items,...upcoming,imageOfDay.current, ...previous, {type: "end"}]
  //   // Add in order of time
    
  //   items = items.filter(notUndefined => notUndefined != undefined)


  //   // console.log(items.length)
  //   // Insert image
  //   setItems(items.map((item, index) => {
  //     if (item.type == "launch"){
  //       return <ForYouLaunch data={item} key={index}/>
  //     } else if (item.type == "event"){
  //       return <ForYouEvent data={item} key={index}/>
  //     }
  //     else if (item.type == "image"){
  //       return <ForYouImageOfDay data={imageOfDay.current} key={index}/>
  //     }
  //     else if (item.type == "news"){
  //       return <ForYouNews data={userContext.news.slice(0,3)} key={index}/>
  //     }
  //     else if (item.type == "end"){
  //       return <ForYouEnd data={userContext.news.slice(0,3)} key={index}/>
  //     }
  //     else {
  //       return <ForYouEvent data={item} key={index}/>
  //     }
  //   }))

  // }
  
  const onPageScroll = (state) => {
    timer.current = 0;
  }

  function setPage(page){
    if (pagerRef.current == null){
      return;
    }

    pagerRef.current.setPage(page);
  }

  // Called when the page is changed
  const onPageSelected = (event) => {
    // Handle page selection
    const { position } = event.nativeEvent;

    curPage.current = position;


  };
  // console.log(items.length)

  if (items.length == 0 || items == null){
    return <Loading/>
  }
  return(
      <View style={styles.container}>
        <FlatList 
          contentContainerStyle={styles.foryouContainer}
          data={items}
          renderItem={({item}) => <ForYouLaunch data={item}/>}
          initialScrollIndex={0}
          disableIntervalMomentum={ true } 
          snapToInterval={Dimensions.get('window').height+StatusBar.currentHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
}


const styles = StyleSheet.create({
  container:{
    height: Dimensions.get('window').height+StatusBar.currentHeight,
  },
  foryouContainer: {
  },
  loadingContainer:{
    // width:"100%",
    height: "100%",
    // backgroundColor: 'white',
    paddingTop: StatusBar.currentHeight+TOP_BAR_HEIGHT,
    
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    
  },
  loadingTop:{
    // width: '100%',
    // flex: 1,
    // marginBottom: 300,
    height: '20%',
    backgroundColor: 'rgba(52, 52, 52, 1)',
    borderRadius: 10,
    marginHorizontal: 10,
    paddingBottom: 5,
    overflow: "hidden",

  },
  loadingBottom:{
    // flex: 1,
    height: '40%',
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    // margin: "4%",
    margin: 10,
    borderRadius: 10,
    padding: 5,
    paddingBottom: 0,

    backgroundColor: 'rgba(52, 52, 52, 1)',

    overflow: "hidden",
    
  },
});
