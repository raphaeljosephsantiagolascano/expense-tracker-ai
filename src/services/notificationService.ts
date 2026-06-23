import { Platform } from "react-native";

type NotificationsModule = {
  AndroidImportance: { DEFAULT: number };
  getPermissionsAsync: () => Promise<{ granted: boolean }>;
  requestPermissionsAsync: () => Promise<{ granted: boolean }>;
  scheduleNotificationAsync: (input: unknown) => Promise<string>;
  setNotificationChannelAsync: (id: string, config: unknown) => Promise<unknown>;
  setNotificationHandler: (handler: unknown) => void;
};

function getNotifications(): NotificationsModule | null {
  try {
    return (eval("require")("expo-notifications") ?? null) as NotificationsModule;
  } catch {
    return null;
  }
}

getNotifications()?.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    const notifications = getNotifications();

    if (!notifications) {
      return false;
    }

    await notifications.setNotificationChannelAsync("pocket-pilot", {
      name: "Pocket Pilot",
      importance: notifications.AndroidImportance.DEFAULT,
    });
  }

  const notifications = getNotifications();

  if (!notifications) {
    return false;
  }

  const existing = await notifications.getPermissionsAsync();

  if (existing.granted) {
    return true;
  }

  const requested = await notifications.requestPermissionsAsync();

  return requested.granted;
}

export async function sendLocalNotification(title: string, body: string) {
  const granted = await requestNotificationPermissions();

  if (!granted) {
    return;
  }

  const notifications = getNotifications();

  if (!notifications) {
    return;
  }

  await notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null,
  });
}

export async function sendBudgetWarningNotification(remainingBudget: number) {
  await sendLocalNotification(
    "Budget warning",
    `Your remaining budget is ₱${remainingBudget.toFixed(2)}.`,
  );
}

export async function sendAchievementNotification(title: string) {
  await sendLocalNotification("Achievement unlocked", title);
}

export async function sendRecurringReminderNotification(title: string) {
  await sendLocalNotification("Recurring bill due soon", title);
}
