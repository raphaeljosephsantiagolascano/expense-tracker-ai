import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  pullSettingsFromCloud,
  pushSettingsToCloud,
} from "@/services/cloudSyncService";
import { UserSettings } from "@/types/settings";

const DEFAULT_SETTINGS: UserSettings = {
  profileName: "Pocket Pilot User",
  darkMode: false,
  notifications: {
    enabled: true,
    budgetWarnings: true,
    recurringReminders: true,
    achievementNotifications: true,
  },
};

type SettingsContextType = {
  settings: UserSettings;
  updateSettings: (settings: UserSettings) => void;
  exportData: (data: unknown) => string;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    saveSettings();
  }, [settings]);

  useEffect(() => {
    if (!user) return;

    pullSettingsFromCloud<UserSettings>(user.id)
      .then((cloudSettings) => {
        if (cloudSettings) {
          setSettings({ ...DEFAULT_SETTINGS, ...cloudSettings });
        } else {
          return pushSettingsToCloud(user.id, settings);
        }
      })
      .catch((error) => console.log("Error syncing settings", error));
  }, [user]);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem("userSettings");

      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.log("Error loading settings", error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("userSettings", JSON.stringify(settings));

      if (user) {
        await pushSettingsToCloud(user.id, settings);
      }
    } catch (error) {
      console.log("Error saving settings", error);
    }
  };

  const updateSettings = (nextSettings: UserSettings) => {
    setSettings(nextSettings);
  };

  const exportData = (data: unknown) => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        settings,
        data,
      },
      null,
      2,
    );
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, exportData }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}
