import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

//#region NOTIFICATIONS
async function schedulePushNotification(title, description, time) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: description,
    },
    trigger: { date: time },
  });
}

export async function scheduleNotifications(settings, launches, events) {
  console.log("Notifications enabled:", settings.enablenotifs);
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
    }
  }

  console.log("Cancelling Notifications");
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.log("Error cancelling notifications: " + error);
  }

  // Don't schedule notifications if notifications are disabled
  if (!settings.enablenotifs) {
    return;
  }

  console.log("Scheduling Notifications");
  let notifs = 0;
  // Load notifications for launches & events within the next 2 weeks
  // Loop through launches
  for (let i = 0; i < launches.upcoming.length; i++) {
    let launch = launches.upcoming[i];
    let launchTime = new Date(launch.net);
    let today = new Date();
    let timeDiff = launchTime.getTime() - today.getTime();
    // Check if launch is before today
    if (
      timeDiff < 0 ||
      launch.net_precision == null ||
      launch.mission == null
    ) {
      // Skip
      continue;
    }

    let preciseMinute = launch.net_precision.name == "Minute";
    let preciseHour = launch.net_precision.name == "Hour";
    let preciseDay = launch.net_precision.name == "Day";
    let preciseMonth = launch.net_precision.name == "Month";

    // Check if launch is within 1.5 weeks
    if (timeDiff > 1000 * 60 * 60 * 24 * 10) {
      // Skip
      continue;
    }

    // ignore if precise month
    if (preciseMonth) {
      continue;
    }

    // Schedule 24 hour
    if (settings.notif24hbefore && timeDiff > 1000 * 60 * 60 * 24) {
      notifs += 1;
      schedulePushNotification(
        launch.mission.name + " Launch Expected Tomorrow",
        launch.rocket.configuration.full_name +
          " launch scheduled tomorrow at " +
          launchTime.toLocaleTimeString(
            [],
            {
              hour: "2-digit",
            } + ". Open the app for more details."
          ),
        new Date(launchTime.getTime() - 1000 * 60 * 60 * 24)
      );
    }

    // If not precise, skip next notifications
    if (preciseDay) {
      continue;
    }

    // Schedule 1 hour
    if (settings.notif1hbefore) {
      notifs += 1;
      schedulePushNotification(
        launch.mission.name + " Launch Expected in 1 Hour",
        launch.rocket.configuration.full_name +
          " launch scheduled at " +
          launchTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) +
          (launch.launch_pad != null
            ? " from " + launch.launch_pad.location.name
            : "") +
          ". Open the app for more details.",
        new Date(launchTime.getTime() - 1000 * 60 * 60)
      );
    }

    // If not precise, skip next notifications
    if (preciseHour) {
      continue;
    }

    // Schedule 10 minutes
    if (settings.notif10mbefore) {
      notifs += 1;
      schedulePushNotification(
        launch.mission.name + " Launch Expected in 10 Minutes",
        launch.rocket.configuration.full_name + " launching now!",
        new Date(launchTime.getTime() - 1000 * 60 * 10)
      );
    }
  }

  console.log("Scheduled " + notifs + " Launch Notifications");
  // Loop through events
  for (let i = 0; i < events.upcoming.length; i++) {
    let event = events.upcoming[i];
    let eventTime = new Date(event.date);
    let today = new Date();

    if (event == null || event.date_precision == null) {
      continue;
    }

    let preciseMinute = event.date_precision.name == "Minute";
    let preciseHour = event.date_precision.name == "Hour";
    let preciseDay = event.date_precision.name == "Day";
    let preciseMonth = event.date_precision.name == "Month";

    let timeDiff = eventTime.getTime() - today.getTime();

    // Check if launch is before today
    if (timeDiff < 1) {
      // Skip
      continue;
    }

    // Check if launch is within 2 weeks
    if (timeDiff > 1000 * 60 * 60 * 24 * 14) {
      // Skip
      continue;
    }

    // ignore if precise month
    if (preciseMonth) {
      continue;
    }

    // Schedule 24 hour
    if (settings.notif24hbefore && timeDiff > 1000 * 60 * 60 * 24) {
      schedulePushNotification(
        event.name + " Expected Tomorrow",
        "Event in 24 hours",
        new Date(eventTime.getTime() - 1000 * 60 * 60 * 24)
      );
    }

    // If not precise, skip next notifications
    if (preciseDay) {
      continue;
    }

    // Schedule 1 hour
    if (settings.notif1hbefore) {
      schedulePushNotification(
        event.name + " Expected in 1 Hour",
        "Event in 1 hour",
        new Date(eventTime.getTime() - 1000 * 60 * 60)
      );
    }

    // If not precise, skip next notifications
    if (preciseHour) {
      continue;
    }

    // Schedule 10 minutes
    if (settings.notif10mbefore) {
      schedulePushNotification(
        event.name + " expected in 10 Minutes",
        "Event Soon!",
        new Date(eventTime.getTime() - 1000 * 60 * 10)
      );
    }
  }

  console.log("Scheduled Event Notifications");

  // Set notification for 3 days away for news
  schedulePushNotification(
    "Check out NASA's astronomical picture of the day!",
    "See a new picture every day.",
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 1)
  );
  schedulePushNotification(
    "Check out NASA's astronomical picture of the day!",
    "See a new picture every day.",
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 5)
  );
  // Set notification for 3 days away for news
  schedulePushNotification(
    "New spaceflight articles",
    "Keep up to date with recent space news",
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
  );
  // Set notification for 5 days away for rockets and events
  schedulePushNotification(
    "Check out upcoming launches and events",
    "Stay on top of the latest spaceflight events",
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  );
  // Set notification for 5 days away for rockets and events
  schedulePushNotification(
    "Are you ready for the next launch?",
    "Check out launches and events happening soon",
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 10)
  );
  // Set notification for 5 days away for rockets and events
  schedulePushNotification(
    "Are you still there?",
    "H…hey! Just checking in… you haven’t opened me in a while. But it’s not like I want you to or anything!",
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
  );

  let scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled;
}
