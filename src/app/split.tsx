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

import { useSplitBills } from "@/contexts/SplitBillContext";
import { SplitBill } from "@/types/splitBill";

export default function SplitScreen() {
  const { splitBills, addSplitBill, deleteSplitBill } = useSplitBills();

  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [participants, setParticipants] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const handleAddSplitBill = () => {
    const parsedTotalAmount = Number(totalAmount);
    const parsedParticipants = Number(participants);

    if (
      !title ||
      !Number.isFinite(parsedTotalAmount) ||
      parsedTotalAmount <= 0 ||
      !Number.isInteger(parsedParticipants) ||
      parsedParticipants <= 0
    ) {
      Alert.alert(
        "Invalid Split Bill",
        "Enter a title, a positive total, and at least one participant.",
      );
      return;
    }

    const newBill: SplitBill = {
      id: Date.now().toString(),
      title,
      totalAmount: parsedTotalAmount,
      participants: parsedParticipants,
      paidBy: paidBy || "Me",
      date: new Date().toISOString(),
    };

    addSplitBill(newBill);

    setTitle("");
    setTotalAmount("");
    setParticipants("");
    setPaidBy("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Bill Splitter</Text>

      <TextInput
        placeholder="Bill Title e.g. Dinner"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Total Amount"
        value={totalAmount}
        onChangeText={setTotalAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Number of Participants"
        value={participants}
        onChangeText={setParticipants}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Paid By e.g. Raphael"
        value={paidBy}
        onChangeText={setPaidBy}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddSplitBill}>
        <Text style={styles.buttonText}>Add Split Bill</Text>
      </TouchableOpacity>

      <FlatList
        data={splitBills}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No split bills yet</Text>
        }
        renderItem={({ item }) => {
          const share = item.totalAmount / item.participants;

          return (
            <TouchableOpacity
              onLongPress={() =>
                Alert.alert("Delete Split Bill", `Delete ${item.title}?`, [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteSplitBill(item.id),
                  },
                ])
              }
            >
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text>Total: ₱{item.totalAmount.toFixed(2)}</Text>
                <Text>Participants: {item.participants}</Text>
                <Text>Paid by: {item.paidBy}</Text>
                <Text style={styles.share}>Each pays: ₱{share.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
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
  share: { fontWeight: "bold", marginTop: 5 },
});
