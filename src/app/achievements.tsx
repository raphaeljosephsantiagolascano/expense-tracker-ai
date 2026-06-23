import { FlatList, StyleSheet, Text, View } from "react-native";

import { useAchievements } from "@/contexts/AchievementContext";

export default function AchievementsScreen() {
  const { achievements } = useAchievements();
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <View style={styles.summaryCard}>
        <Text>
          {unlockedCount} of {achievements.length} unlocked
        </Text>
      </View>

      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.unlocked ? "☑ " : "☐ "}
              {item.title}
            </Text>
            <Text>{item.description}</Text>
            {item.unlockedAt && (
              <Text style={styles.meta}>
                Unlocked {new Date(item.unlockedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  summaryCard: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  meta: { color: "gray", marginTop: 5 },
});
