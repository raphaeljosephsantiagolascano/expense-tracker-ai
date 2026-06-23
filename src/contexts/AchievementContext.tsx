import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import {
  pullItemsFromCloud,
  pushItemsToCloud,
} from "@/services/cloudSyncService";
import {
  createDefaultAchievements,
  unlockAchievements,
} from "@/services/achievementService";
import { sendAchievementNotification } from "@/services/notificationService";
import { Achievement, AchievementId } from "@/types/achievement";

type AchievementContextType = {
  achievements: Achievement[];
  unlock: (ids: AchievementId[]) => void;
};

const AchievementContext = createContext<AchievementContextType | undefined>(
  undefined,
);

export function AchievementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [achievements, setAchievements] = useState<Achievement[]>(
    createDefaultAchievements(),
  );

  useEffect(() => {
    loadAchievements();
  }, []);

  useEffect(() => {
    saveAchievements();
  }, [achievements]);

  useEffect(() => {
    if (!user) return;

    pullItemsFromCloud<Achievement>("achievements", user.id)
      .then((cloudAchievements) => {
        if (cloudAchievements.length > 0) {
          setAchievements(mergeAchievements(cloudAchievements));
        } else {
          return pushItemsToCloud("achievements", user.id, achievements);
        }
      })
      .catch((error) => console.log("Error syncing achievements", error));
  }, [user]);

  const mergeAchievements = (stored: Achievement[]) => {
    return createDefaultAchievements().map((achievement) => {
      const storedAchievement = stored.find((item) => item.id === achievement.id);

      return storedAchievement ? { ...achievement, ...storedAchievement } : achievement;
    });
  };

  const loadAchievements = async () => {
    try {
      const stored = await AsyncStorage.getItem("achievements");

      if (stored) {
        setAchievements(mergeAchievements(JSON.parse(stored)));
      }
    } catch (error) {
      console.log("Error loading achievements", error);
    }
  };

  const saveAchievements = async () => {
    try {
      await AsyncStorage.setItem("achievements", JSON.stringify(achievements));

      if (user) {
        await pushItemsToCloud("achievements", user.id, achievements);
      }
    } catch (error) {
      console.log("Error saving achievements", error);
    }
  };

  const unlock = (ids: AchievementId[]) => {
    if (ids.length === 0) return;

    setAchievements((prev) => {
      const nextAchievements = unlockAchievements(prev, ids);

      ids.forEach((id) => {
        const achievement = nextAchievements.find((item) => item.id === id);

        if (
          achievement &&
          settings.notifications.enabled &&
          settings.notifications.achievementNotifications
        ) {
          sendAchievementNotification(achievement.title);
        }
      });

      return nextAchievements;
    });
  };

  return (
    <AchievementContext.Provider value={{ achievements, unlock }}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);

  if (!context) {
    throw new Error("useAchievements must be used within AchievementProvider");
  }

  return context;
}
