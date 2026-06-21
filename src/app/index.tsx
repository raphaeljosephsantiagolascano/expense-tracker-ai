import { useExpenses } from "@/contexts/ExpenseContext";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { expenses } = useExpenses();

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Expense Tracker AI</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Today's Spending</Text>
        <Text style={styles.amount}>₱{totalSpent.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>This Month</Text>
        <Text style={styles.amount}>₱{totalSpent.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Recent Expenses</Text>
        <Text>No expenses yet</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },

  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#000000",
  },

  label: {
    fontSize: 14,
    color: "#ffffff",
  },

  amount: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
    color: "#ffffff",
  },
});
