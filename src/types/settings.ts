export type NotificationPreferences = {
  enabled: boolean;
  budgetWarnings: boolean;
  recurringReminders: boolean;
  achievementNotifications: boolean;
};

export type UserSettings = {
  profileName: string;
  darkMode: boolean;
  notifications: NotificationPreferences;
};
