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
      <View style={styles.topSection}>
          <Text style={styles.titleText}>Launches</Text>
      </View>
      {/* Pinned Section */}

      {/* Upcoming Section */}
      <View style={styles.contentSection}>
        <Text style={styles.contentHeader}>Upcoming </Text>
        {launchData.map((launch: any) => {
          return (
            <LaunchInfo key={launch.id} data={launch} />
          );
      })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Header Bar Section
    topSection: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.BACKGROUND,
      padding: 10,
      height: 60,
    },
    titleText: {
      fontSize: 24,
      flex: 1,
      color: colors.FOREGROUND,
      // position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuButton:{},
    immersiveButton:{},

    // Content Section
    contentSection: {
      display: 'flex',
      backgroundColor: colors.BACKGROUND,
      height: '100%',
    },
    contentHeader: {
      fontSize: 32,
      color: colors.FOREGROUND,
      
      marginLeft: 8,
      marginBottom: 10,
    },
});