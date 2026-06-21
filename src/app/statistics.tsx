import { useExpenses } from "@/contexts/ExpenseContext";
import { StyleSheet, Text, View } from "react-native";

export default function StatisticsScreen() {
  const { expenses } = useExpenses();

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categories = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;

      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics</Text>

      {Object.entries(categories).map(([category, amount]) => (
        <View key={category} style={styles.card}>
          <Text>{category}</Text>
          <Text>₱{amount}</Text>
        </View>
      ))}

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Expenses</Text>

        <Text style={styles.totalAmount}>₱{total}</Text>
      </View>
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

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
  },

  totalCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#007AFF",
  },

  totalLabel: {
    color: "white",
  },

  totalAmount: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },
});
