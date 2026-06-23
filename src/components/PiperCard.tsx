import { StyleSheet, Text, View } from "react-native";

type Props = {
  mood: string;
  message: string;
};

export default function PiperCard({ mood, message }: Props) {
  const emoji =
    mood === "happy"
      ? "😊"
      : mood === "neutral"
        ? "🙂"
        : mood === "concerned"
          ? "😟"
          : "🚨";

  return (
    <View style={styles.card}>
      <Text style={styles.avatar}>{emoji} Piper</Text>

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#EAF4FF",
    marginBottom: 20,
  },

  avatar: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  message: {
    fontSize: 16,
  },
});
