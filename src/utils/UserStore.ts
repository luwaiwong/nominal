
import { create } from "zustand";

// Set cache call time
// If last call less than x minutes ago, use cache
const cachecalltime = 1000 * 60 * 60;
const extradatacalltime = 1000 * 60 * 90;
const twomin = 1000 * 60 * 2;

/* 
  This project uses Zustand to handle state throughout the app
  State and Action define the variables and functions which can be accessed by the app
  useUserStore defines the default variables, and behaviour of the functions

  The Functions and Variables are hooks that react functions can use to update data
*/

type State = {
  nav: any,
  menuBarShown: boolean,
  livestreams: [],

  upcomingLaunches: [],
  previousLaunches: [],
  upcomingEvents: [],
  previousEvents: [],
};

type Action = {
  setNav: (data: State["nav"]) => void,
  setMenuBarShown: (data: State["menuBarShown"]) => void,
  setLivestreams: (data: State["livestreams"]) => void,

  setUpcomingLaunches: (data: State["upcomingLaunches"]) => void,
  setPreviousLaunches: (data: State["previousLaunches"]) => void,
  setUpcomingEvents: (data: State["upcomingEvents"]) => void,
  setPreviousEvents: (data: State["previousEvents"]) => void,
};

export const useUserStore = create<State & Action>((set) => ({
  nav: null,
  theme: {},
  menuBarShown: true,
  livestreams: [],

  upcomingLaunches: [],
  previousLaunches: [],
  upcomingEvents: [],
  previousEvents: [],
  nasaIOD: [],

  setMenuBarShown: (data) => set(()=>({menuBarShown: data})),
  setNav: (data) => set(()=>({nav: data})),
  setLivestreams: (data)=> set(()=>({livestreams:data})),

  setUpcomingLaunches: (data) => set(() => ({upcomingLaunches: data})),
  setPreviousLaunches: (data) => set(() => ({previousLaunches: data})),
  setUpcomingEvents: (data) => set(() => ({upcomingEvents: data})),
  setPreviousEvents: (data) => set(() => ({previousEvents: data})),
}))
