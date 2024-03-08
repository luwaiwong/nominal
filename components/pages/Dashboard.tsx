import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { useEffect, useState } from "react";

import LaunchInfo from "../styled/LaunchInfo";

import * as colors from "../colors";

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
        <View style={styles.topbar}>
            <Text style={styles.title}>Launches</Text>
        </View>

      {launchData.map((launch: any) => {
        return (
          <LaunchInfo key={launch.id} data={launch} />
        );
      })}
    </View>
  );

}


const styles = StyleSheet.create({
    topbar: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.BACKGROUND,
        padding: 10,
    },
    title: {
        flex: 1,
        color: colors.FOREGROUND,
        // position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
    },
});