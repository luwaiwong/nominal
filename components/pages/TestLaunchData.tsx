import { View, Text } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import UserData from "../data/UserContext";

export default function TestLaunchData(data) {
  let userData = data.data;
  let [launchData, setLaunchData] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      await userData.getUpcomingLaunches().then((data) => {
        setLaunchData(data);
      })
    }
    fetchData();
  }, []);

  return (
    <View>
      <Text>TestLaunchData</Text>
      {launchData.map((launch: any) => {
        return (
          <View key={launch.id}>
            <Text>{launch.name}</Text>
          </View>
        );
      })}
    </View>
  );
}
