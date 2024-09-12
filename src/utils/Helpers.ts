import { useUserStore } from "./UserStore";

var currentOffset = 0;
export const HideMenuBarOnScroll = (event, setMenuBarShown) => {
    console.log(currentOffset)
    let direction = event.nativeEvent.contentOffset.y > currentOffset ? 'down' : 'up';
    currentOffset = event.nativeEvent.contentOffset.y;
    if (event.contentOffset != undefined && event.contentOffset.y == 0){
        setMenuBarShown(true)
    } else if (direction == "down"){
        setMenuBarShown(false)
    } else {
        setMenuBarShown(true)
    }
}
export const HideMenuBarOnScrollFlatList = (event, setMenuBarShown) => {
    console.log(currentOffset)
    // let direction = event.nativeEvent.contentOffset.y > currentOffset ? 'down' : 'up';
    // currentOffset = event.nativeEvent.contentOffset.y;
    // if (event.contentOffset != undefined && event.contentOffset.y == 0){
    //     setMenuBarShown(true)
    // } else if (direction == "down"){
    //     setMenuBarShown(false)
    // } else {
    //     setMenuBarShown(true)
    // }
}