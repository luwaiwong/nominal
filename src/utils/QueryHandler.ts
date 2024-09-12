import { QueryClient, useQuery } from "@tanstack/react-query";
import * as API from "./APIHandler";
import { useUserStore } from "./UserStore";
import { Alert } from "react-native";

/* This project uses Tanstack/react-query for api call handling
  use QueryHandler to creat the query handler

  use____Query funcitons handles different types of api calls
  Logic for merging data, and when to store data is handled here

*/
export const QueryHandler = new QueryClient({
  defaultOptions: {
    queries: {
        gcTime:1000 * 60 * 60, // 1 hour
        staleTime: 1000 * 60 * 25, // 25 minutes
    },
  }
})

export function useUpcoming10LaunchesQuery(){
  const upcomingLaunches = useUserStore((state)=>state.upcomingLaunches)
  const setUpcomingLaunches = useUserStore((state)=>state.setUpcomingLaunches)
  const query = useQuery({
    queryKey: ['upcomingLaunches'],
    queryFn: async () => {
      const data = await API.fetchUpcomingLaunches();

      if (upcomingLaunches.length <= 10) setUpcomingLaunches(data)
      return data;
    },
  });

  return query
}
export function usePrevious10LaunchesQuery(){
  const previousLaunches = useUserStore((state)=>state.previousLaunches)
  const setPreviousLaunches = useUserStore((state)=>state.setPreviousLaunches)
  const query = useQuery({
    queryKey: ['previousLaunches'],
    queryFn: async () => {
      const data = await API.fetchPreviousLaunches();

      if (previousLaunches.length <= 10) setPreviousLaunches(data)
      return data;
    },
  });

  return query
}

export function useLaunchesQuery(type: string, limit: number, offset:number){
  const setUpcomingLaunches = useUserStore((state)=>state.setUpcomingLaunches)
  const setPreviousLaunches = useUserStore((state)=>state.setPreviousLaunches)
  
  const query = useQuery({
    queryKey: ["limit:"+limit+"offset:"+offset+"type:"+type+'Launches'],
    queryFn: async () => {
      const data = await API.fetchLaunches(type, limit, offset);

      if (type == 'upcoming'){
        setUpcomingLaunches(data)
      }
      else if (type == 'previous'){
        setPreviousLaunches(data)
      }
      else {
        Alert.alert("Launch query type invalid")
      }
      return data;
    }
  });

  return query
}

export function useUpcomingEventsQuery(){
  const setUpcomingEvents = useUserStore((state)=>state.setUpcomingEvents)
  const query = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      const data = await API.fetchUpcomingEvents();
      setUpcomingEvents(data.results)
      return data;
    }
  });

  return query
}

export function usePreviousEventsQuery(){
  const setPreviousEvents = useUserStore((state)=>state.setPreviousEvents)
  const query = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      console.log("Querying")
      const data = await API.fetchPreviousEvents();

      setPreviousEvents(data)
      return data;
    }
  });

  return query
}