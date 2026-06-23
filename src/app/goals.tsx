import { useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useSavingsGoals } from "@/contexts/SavingsGoalContext";
import { SavingsGoal } from "@/types/savingsGoal";

export default function GoalsScreen() {
  const { goals, addGoal, deleteGoal } = useSavingsGoals();

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");

  const handleAddGoal = () => {
    const parsedTargetAmount = Number(targetAmount);
    const parsedCurrentAmount = Number(currentAmount || 0);

    if (
      !title ||
      !Number.isFinite(parsedTargetAmount) ||
      parsedTargetAmount <= 0 ||
      !Number.isFinite(parsedCurrentAmount) ||
      parsedCurrentAmount < 0
    ) {
      Alert.alert(
        "Invalid Goal",
        "Enter a title, a positive target amount, and valid current savings.",
      );
      return;
    }

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      title,
      targetAmount: parsedTargetAmount,
      currentAmount: parsedCurrentAmount,
    };

    addGoal(newGoal);

    setTitle("");
    setTargetAmount("");
    setCurrentAmount("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Savings Goals</Text>

      <TextInput
        placeholder="Goal Name"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Target Amount"
        keyboardType="numeric"
        value={targetAmount}
        onChangeText={setTargetAmount}
        style={styles.input}
      />

      <TextInput
        placeholder="Current Savings"
        keyboardType="numeric"
        value={currentAmount}
        onChangeText={setCurrentAmount}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddGoal}>
        <Text style={styles.buttonText}>Add Goal</Text>
      </TouchableOpacity>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const progress = (item.currentAmount / item.targetAmount) * 100;

          return (
            <TouchableOpacity
              onLongPress={() =>
                Alert.alert("Delete Goal", `Delete ${item.title}?`, [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteGoal(item.id),
                  },
                ])
              }
            >
              <View style={styles.goalCard}>
                <Text style={styles.goalTitle}>{item.title}</Text>

                <Text>
                  ₱{item.currentAmount.toFixed(2)}
                  {" / "}₱{item.targetAmount.toFixed(2)}
                </Text>

                <Text>Progress: {progress.toFixed(0)}%</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },

  goalCard: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
});
