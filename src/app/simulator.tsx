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
import { calculateProjectedSpending } from "@/services/simulatorService";

export default function SimulatorScreen() {
  const { budget } = useBudget();

  const [dailySpend, setDailySpend] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const handleSimulate = () => {
    const parsedDailySpend = Number(dailySpend);

    if (!Number.isFinite(parsedDailySpend) || parsedDailySpend < 0) {
      Alert.alert("Invalid Daily Spending", "Enter a valid daily spending amount.");
      return;
    }

    const projection = calculateProjectedSpending(parsedDailySpend);

    setResult(projection.projectedMonthly);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📈 Spending Simulator</Text>

      <TextInput
        placeholder="Daily Spending"
        keyboardType="numeric"
        value={dailySpend}
        onChangeText={setDailySpend}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSimulate}>
        <Text style={styles.buttonText}>Simulate</Text>
      </TouchableOpacity>

      {result !== null && (
        <View style={styles.resultCard}>
          <Text>Projected Spending:</Text>

          <Text style={styles.amount}>₱{result.toFixed(2)}</Text>

          <Text>Remaining Budget:</Text>

          <Text style={styles.amount}>₱{(budget - result).toFixed(2)}</Text>
        </View>
      )}
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
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },

  resultCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },

  amount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
