import { Picker } from "@react-native-picker/picker";
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

import { useRecurringExpenses } from "@/contexts/RecurringExpenseContext";
import { RecurringExpense } from "@/types/recurringExpense";

export default function RecurringScreen() {
  const { recurringExpenses, addRecurringExpense, deleteRecurringExpense } =
    useRecurringExpenses();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Bills");
  const [frequency, setFrequency] = useState<"Monthly" | "Weekly">("Monthly");
  const [nextDueDate, setNextDueDate] = useState("");
  const isDueSoon = (date: string) => {
    const today = new Date();
    const due = new Date(date);

    const diffDays = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    return diffDays >= 0 && diffDays <= 3;
  };
  const handleAdd = () => {
    const parsedAmount = Number(amount);
    const parsedDueDate = new Date(nextDueDate);

    if (
      !title ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0 ||
      Number.isNaN(parsedDueDate.getTime())
    ) {
      Alert.alert(
        "Invalid Recurring Expense",
        "Enter a title, a positive amount, and a valid due date.",
      );
      return;
    }

    const newRecurringExpense: RecurringExpense = {
      id: Date.now().toString(),
      title,
      amount: parsedAmount,
      category,
      frequency,
      nextDueDate: parsedDueDate.toISOString(),
    };

    addRecurringExpense(newRecurringExpense);

    setTitle("");
    setAmount("");
    setCategory("Bills");
    setFrequency("Monthly");
    setNextDueDate("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔁 Recurring Expenses</Text>

      <TextInput
        placeholder="Title e.g. Netflix"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Next Due Date YYYY-MM-DD"
        value={nextDueDate}
        onChangeText={setNextDueDate}
        style={styles.input}
      />

      <Picker
        selectedValue={category}
        onValueChange={(value) => setCategory(value)}
      >
        <Picker.Item label="Bills" value="Bills" />
        <Picker.Item label="Entertainment" value="Entertainment" />
        <Picker.Item label="Transportation" value="Transportation" />
        <Picker.Item label="Health" value="Health" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Picker
        selectedValue={frequency}
        onValueChange={(value) => setFrequency(value)}
      >
        <Picker.Item label="Monthly" value="Monthly" />
        <Picker.Item label="Weekly" value="Weekly" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Recurring Expense</Text>
      </TouchableOpacity>

      <FlatList
        data={recurringExpenses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No recurring expenses yet</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() =>
              Alert.alert("Delete Recurring Expense", `Delete ${item.title}?`, [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => deleteRecurringExpense(item.id),
                },
              ])
            }
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text>{item.category}</Text>
              <Text>₱{item.amount.toFixed(2)}</Text>
              <Text>{item.frequency}</Text>
              <Text>Due: {new Date(item.nextDueDate).toDateString()}</Text>

              {isDueSoon(item.nextDueDate) && (
                <Text style={styles.warning}>⚠️ Due soon</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
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
  buttonText: { color: "white", textAlign: "center", fontWeight: "600" },
  empty: { textAlign: "center", marginTop: 40, color: "gray" },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  warning: {
    color: "orange",
    fontWeight: "bold",
    marginTop: 5,
  },
});
