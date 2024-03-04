import { View, Text } from "react-native";
import React from "react";

import * as UserData from "./UserData";

export default function TestLaunchData() {
  UserData.getUpcomingLaunches();

  return (
    <View>
      <Text>TestLaunchData</Text>
    </View>
  );
}
