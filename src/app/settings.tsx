import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { useCloudSync } from "@/contexts/CloudSyncContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useGroceries } from "@/contexts/GroceryContext";
import { useRecurringExpenses } from "@/contexts/RecurringExpenseContext";
import { useSavingsGoals } from "@/contexts/SavingsGoalContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useSplitBills } from "@/contexts/SplitBillContext";
import { requestNotificationPermissions } from "@/services/notificationService";

export default function SettingsScreen() {
  const { user } = useAuth();
  const { syncing, error, lastSyncedAt, syncNow } = useCloudSync();
  const { settings, updateSettings, exportData } = useSettings();
  const { expenses } = useExpenses();
  const { goals } = useSavingsGoals();
  const { groceryItems } = useGroceries();
  const { splitBills } = useSplitBills();
  const { recurringExpenses } = useRecurringExpenses();
  const [exportedData, setExportedData] = useState("");

  const updateNotificationPreference = (
    key: keyof typeof settings.notifications,
    value: boolean,
  ) => {
    updateSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  const handleExport = () => {
    setExportedData(
      exportData({
        expenses,
        goals,
        groceryItems,
        splitBills,
        recurringExpenses,
      }),
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile</Text>
        <Text>{user?.email ?? "Not signed in"}</Text>
        <TextInput
          placeholder="Profile name"
          value={settings.profileName}
          onChangeText={(profileName) =>
            updateSettings({ ...settings, profileName })
          }
          style={styles.input}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notifications</Text>
        <SettingToggle
          label="Notifications"
          value={settings.notifications.enabled}
          onPress={async () => {
            if (!settings.notifications.enabled) {
              await requestNotificationPermissions();
            }
            updateNotificationPreference(
              "enabled",
              !settings.notifications.enabled,
            );
          }}
        />
        <SettingToggle
          label="Budget warnings"
          value={settings.notifications.budgetWarnings}
          onPress={() =>
            updateNotificationPreference(
              "budgetWarnings",
              !settings.notifications.budgetWarnings,
            )
          }
        />
        <SettingToggle
          label="Recurring reminders"
          value={settings.notifications.recurringReminders}
          onPress={() =>
            updateNotificationPreference(
              "recurringReminders",
              !settings.notifications.recurringReminders,
            )
          }
        />
        <SettingToggle
          label="Achievement notifications"
          value={settings.notifications.achievementNotifications}
          onPress={() =>
            updateNotificationPreference(
              "achievementNotifications",
              !settings.notifications.achievementNotifications,
            )
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Appearance</Text>
        <SettingToggle
          label="Dark mode"
          value={settings.darkMode}
          onPress={() =>
            updateSettings({ ...settings, darkMode: !settings.darkMode })
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cloud Sync</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <Text>{lastSyncedAt ? `Last synced: ${lastSyncedAt}` : "Not synced yet"}</Text>
        <TouchableOpacity
          style={styles.button}
          disabled={syncing}
          onPress={() => syncNow()}
        >
          <Text style={styles.buttonText}>{syncing ? "Syncing..." : "Sync Now"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Export Data</Text>
        <TouchableOpacity style={styles.button} onPress={handleExport}>
          <Text style={styles.buttonText}>Prepare Export</Text>
        </TouchableOpacity>
        {exportedData && (
          <>
            <TextInput
              value={exportedData}
              multiline
              editable={false}
              style={styles.exportBox}
            />
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => Alert.alert("Export ready", "Your export is shown above.")}
            >
              <Text style={styles.secondaryButtonText}>Export Ready</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function SettingToggle({
  label,
  value,
  onPress,
}: {
  label: string;
  value: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.toggleRow} onPress={onPress}>
      <Text>{value ? "☑" : "☐"}</Text>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingVertical: 6,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "600" },
  secondaryButton: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  secondaryButtonText: { textAlign: "center", fontWeight: "600" },
  exportBox: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    backgroundColor: "#fff",
  },
  error: { color: "#B00020", marginBottom: 10 },
});
