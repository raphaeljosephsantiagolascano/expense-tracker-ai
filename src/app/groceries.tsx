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

import { useBudget } from "@/contexts/BudgetContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useGroceries } from "@/contexts/GroceryContext";
import { calculateGroceryBudgetImpact } from "@/services/groceryService";
import { GroceryItem } from "@/types/groceryItem";

export default function GroceryScreen() {
  const {
    groceryItems,
    addGroceryItem,
    updateGroceryItem,
    deleteGroceryItem,
    togglePurchased,
  } = useGroceries();
  const { expenses } = useExpenses();
  const { budget } = useBudget();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budget - totalSpent;
  const groceryImpact = calculateGroceryBudgetImpact(
    groceryItems,
    remainingBudget,
  );

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setQuantity("");
    setEstimatedPrice("");
  };

  const handleSave = () => {
    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(estimatedPrice);

    if (
      !name ||
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0 ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      Alert.alert(
        "Invalid Grocery Item",
        "Enter a name, a positive quantity, and a valid estimated price.",
      );
      return;
    }

    const item: GroceryItem = {
      id: editingId ?? Date.now().toString(),
      name,
      quantity: parsedQuantity,
      estimatedPrice: parsedPrice,
      purchased:
        groceryItems.find((groceryItem) => groceryItem.id === editingId)
          ?.purchased ?? false,
    };

    if (editingId) {
      updateGroceryItem(item);
    } else {
      addGroceryItem(item);
    }

    resetForm();
  };

  const handleEdit = (item: GroceryItem) => {
    setEditingId(item.id);
    setName(item.name);
    setQuantity(item.quantity.toString());
    setEstimatedPrice(item.estimatedPrice.toString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grocery Planner</Text>

      <View style={styles.summaryCard}>
        <Text>Total Grocery Cost: ₱{groceryImpact.totalCost.toFixed(2)}</Text>
        <Text>
          Pending Grocery Cost: ₱{groceryImpact.unpurchasedCost.toFixed(2)}
        </Text>
        <Text>
          Budget After Groceries: ₱
          {groceryImpact.remainingAfterGroceries.toFixed(2)}
        </Text>
      </View>

      <TextInput
        placeholder="Item name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Estimated price"
        value={estimatedPrice}
        onChangeText={setEstimatedPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {editingId ? "Save Grocery Item" : "Add Grocery Item"}
        </Text>
      </TouchableOpacity>

      {editingId && (
        <TouchableOpacity style={styles.secondaryButton} onPress={resetForm}>
          <Text style={styles.secondaryButtonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={groceryItems}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No grocery items yet</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            onLongPress={() =>
              Alert.alert("Delete Grocery Item", `Delete ${item.name}?`, [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => deleteGroceryItem(item.id),
                },
              ])
            }
          >
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => togglePurchased(item.id)}
              >
                <Text style={styles.checkbox}>
                  {item.purchased ? "☑" : "☐"}
                </Text>
                <Text style={styles.cardTitle}>{item.name}</Text>
              </TouchableOpacity>

              <Text>Quantity: {item.quantity}</Text>
              <Text>Estimated Price: ₱{item.estimatedPrice.toFixed(2)}</Text>
              <Text>
                Item Total: ₱
                {(item.quantity * item.estimatedPrice).toFixed(2)}
              </Text>
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
  summaryCard: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
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
    marginBottom: 10,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "600" },
  secondaryButton: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  secondaryButtonText: {
    textAlign: "center",
    fontWeight: "600",
  },
  empty: { textAlign: "center", marginTop: 40, color: "gray" },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkbox: {
    fontSize: 20,
    marginRight: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "600" },
});
