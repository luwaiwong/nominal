import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import {useRef, useEffect, useState, useContext } from "react";
import PagerView from "react-native-pager-view";

import { COLORS, FONT } from "../styles";
import Loading from "../styled/Loading";

import {ForYouLaunch, ForYouEvent, ForYouEnd, ForYouImageOfDay} from "../styled/ForYouItem";
import { UserContext } from "../data/UserContext";
import EventEmitter from "eventemitter3";

var EE = new EventEmitter();

export default function ForYou(props) {
  const userContext = useContext(UserContext);
  const pagerRef = useRef(null);
  const curPage = useRef(0);
  // const [imageOfDay, setImageOfDay] = useState(null)
  
  const [items, setItems]=useState([])
  let userData = props.data.userData;
  let launchData = props.data.launchData;
  let foryou = launchData.foryou;
  let news = launchData.news;
  let imageOfDay = null;

  let timer = useRef(0);  
  // timer to check if the user has not been in the For You page for a while
  // Constantly ticking 1 second timer
  useEffect(() => {

    const intervalId = setInterval(() => {
      // Your code here...
      // console.log('This line is executed every second!');
      timer.current += 1;
      if (timer.current >= 75){
        timer.current = 0;
        setPage(0);
      }
    }, 1000); // 1000 milliseconds = 1 second

    // Clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);

    // Specify empty array as second argument to run only when the component mounts and unmounts
  }, []);// Subscribe and check app state

  async function fetchIOD() {
    return await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
      if (data.url == null) {
        console.log("Error fetching image of the day", data)
        sortForYouItems();
        return null
      }
      imageOfDay = data;
      sortForYouItems();
      return data;

    }).catch((error) => {
        console.log("Error fetching image of the day:", error);
        return null
    })
  }
  useEffect(()=>{
    if (userContext == null){
      return;
    }
    console.log("Setting up for you page")
    fetchIOD();
  }, [userContext])

  function sortForYouItems(){
    foryou.map((item: any, index) => {
      if (item.type == "between" ){
        // console.log("hasbetween")
        // return (<ForYouImageOfDay key={item.id} data={imageOfDay}/>);
      }
    })
    let items = []
    items = foryou.map((item: any, index) => {
      // console.log(item.type)
      if (item.type == "launch"){
        return (
          <ForYouLaunch first={index == 0} key={item.id} data={item} user={userData} nav={props.data.nav}/>
        );
      }
      else if (item.type == "between" && imageOfDay != null){
        console.log("Image of the day", imageOfDay)
        return (<ForYouImageOfDay key={item.id} data={imageOfDay}/>);
      }
      else if (item.type != "between"){
        return (<ForYouEvent key={item.id} data={item} user={userData}  nav={props.data.nav}/>);
      }
    })
    items = items.filter(notUndefined => notUndefined != undefined)
    setItems(items)
  }
  
  const onPageScroll = (state) => {
    timer.current = 0;
  }

  function setPage(page){
    pagerRef.current.setPage(page);
  }
  // Called when the page is changed
  const onPageSelected = (event) => {
    // Handle page selection
    const { position } = event.nativeEvent;

    curPage.current = position;


  };

  if (items.length == 0 || items == null){
    return <></>
  }
  return(
      <PagerView 
        style={styles.immersiveSection} 
        initialPage={curPage.current} 
        orientation="vertical" 
        ref={pagerRef}
        onPageScroll={onPageScroll}
        onPageSelected={onPageSelected}
        >
        {items.map((item: any)=>{
          return item
        })}
        <ForYouEnd data={news.slice(0,3)}/>
      </PagerView>
    );
}


const styles = StyleSheet.create({
  immersiveSection:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    

    // marginTop: 60,

    width: '100%',
    height: '100%',

    backgroundColor: COLORS.FOREGROUND,

    // zIndex: -1000
  },
  immersivePage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    
    width: '100%',
    height: '100%',


    paddingTop: 60,
    backgroundColor: COLORS.FOREGROUND,
  },
  immersivePageTitle:{
    fontSize: 32,
    color: COLORS.BACKGROUND,
    fontFamily: COLORS.ACCENT,
    margin: 16,
  },
});
