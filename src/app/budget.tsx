import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useBudget } from "@/contexts/BudgetContext";

export default function BudgetScreen() {
  const { budget, setBudget } = useBudget();

  const [input, setInput] = useState(budget.toString());

  const handleSaveBudget = () => {
    const parsedBudget = Number(input);

    if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
      Alert.alert("Invalid Budget", "Enter a valid budget amount.");
      return;
    }

    setBudget(parsedBudget);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✈️ Flight Plan</Text>

      <Text style={styles.label}>Monthly Budget</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={input}
        onChangeText={setInput}
        placeholder="Enter budget"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSaveBudget}
      >
        <Text style={styles.buttonText}>Save Budget</Text>
      </TouchableOpacity>

      <Text style={styles.current}>Current Budget: ₱{budget}</Text>
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

  label: {
    fontSize: 16,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },

  current: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
  },
});
