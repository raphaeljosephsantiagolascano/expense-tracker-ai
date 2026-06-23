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

import { useExpenses } from "@/contexts/ExpenseContext";
import { parseExpenseText } from "@/services/parserService";
import { Expense } from "@/types/expense";
import { Picker } from "@react-native-picker/picker";

export default function ExpensesScreen() {
  const { expenses, addExpense, deleteExpense, updateExpense } = useExpenses();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [quickInput, setQuickInput] = useState("");
  const handleAddExpense = () => {
    const parsedAmount = Number(amount);

    if (!description || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid Expense", "Enter a description and a positive amount.");
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parsedAmount,
      category,
      description,
      date: new Date().toISOString(),
    };

    addExpense(newExpense);

    setAmount("");
    setDescription("");
    setCategory("Food");
  };

  const handleSaveExpense = () => {
    const parsedAmount = Number(amount);

    if (
      !description ||
      !editingId ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      Alert.alert("Invalid Expense", "Enter a description and a positive amount.");
      return;
    }

    updateExpense({
      id: editingId,
      amount: parsedAmount,
      description,
      category,
      date: new Date().toISOString(),
    });

    setAmount("");
    setDescription("");
    setCategory("Food");
    setEditingId(null);
  };
  const handleQuickParse = () => {
    const parsed = parseExpenseText(quickInput);

    if (!parsed) {
      Alert.alert("Invalid Input", "Try: Spent 250 on Jollibee");
      return;
    }

    setAmount(parsed.amount.toString());
    setDescription(parsed.description);
    setCategory(parsed.category);

    setQuickInput("");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses</Text>

      <Text style={styles.quickTitle}>✨ Quick Add</Text>

      <TextInput
        placeholder="Spent 250 on Jollibee"
        value={quickInput}
        onChangeText={setQuickInput}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleQuickParse}>
        <Text style={styles.buttonText}>Parse Expense</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Transportation" value="Transportation" />
        <Picker.Item label="Shopping" value="Shopping" />
        <Picker.Item label="Bills" value="Bills" />
        <Picker.Item label="Entertainment" value="Entertainment" />
        <Picker.Item label="Health" value="Health" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <TouchableOpacity
        style={styles.button}
        onPress={editingId ? handleSaveExpense : handleAddExpense}
      >
        <Text style={styles.buttonText}>
          {editingId ? "💾 Save Changes" : "+ Add Expense"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No expenses yet</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setEditingId(item.id);
              setAmount(item.amount.toString());
              setDescription(item.description);
              setCategory(item.category);
            }}
            onLongPress={() =>
              Alert.alert("Delete Expense", `Delete ${item.description}?`, [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => deleteExpense(item.id),
                },
              ])
            }
          >
            <View style={styles.expenseCard}>
              <View>
                <Text style={styles.expenseTitle}>{item.description}</Text>

                <Text style={styles.expenseCategory}>{item.category}</Text>
              </View>

              <Text style={styles.expenseAmount}>₱{item.amount}</Text>
            </View>
          </TouchableOpacity>
        )}
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

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "gray",
  },

  expenseTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  expenseCategory: {
    color: "gray",
    marginTop: 4,
  },

  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },

  expenseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
  },
  quickTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
});
