import { useBudget } from "@/contexts/BudgetContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useGroceries } from "@/contexts/GroceryContext";
import { useSavingsGoals } from "@/contexts/SavingsGoalContext";
import { useSplitBills } from "@/contexts/SplitBillContext";
import { getPiperResponse } from "@/services/chatService";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Message = {
  id: string;
  sender: "user" | "piper";
  text: string;
};

export default function PiperScreen() {
  const { expenses } = useExpenses();
  const { budget } = useBudget();
  const { goals } = useSavingsGoals();
  const [input, setInput] = useState("");
  const { splitBills } = useSplitBills();
  const { groceryItems } = useGroceries();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "piper",
      text: "👋 Hi! I'm Piper, your financial copilot. Ask me anything about your spending, budget, or savings.",
    },
  ]);

  const quickQuestions = [
    "How much did I spend?",
    "How much did I spend on food?",
    "Am I over budget?",
    "What is my biggest category?",
    "Give me advice",
    "Give me insights",
    "My savings goals",
    "My tracking streak",
    "Show my groceries",
    "How much are my groceries?",
    "Can I afford my groceries?",
    "Can I afford 5000?",
    "Show my split bills",
  ];

  const sendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: message,
    };

    const response = getPiperResponse(
      message,
      expenses,
      budget,
      goals,
      splitBills,
      groceryItems,
    );

    const piperMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: "piper",
      text: response,
    };

    setMessages((prev) => [...prev, userMessage, piperMessage]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(input);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>💬 Piper Assistant</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === "user" ? styles.userMessage : styles.piperMessage,
            ]}
          >
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.chipsContainer}>
        {quickQuestions.map((question) => (
          <TouchableOpacity
            key={question}
            style={styles.chip}
            onPress={() => sendMessage(question)}
          >
            <Text style={styles.chipText}>{question}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        placeholder="Ask Piper..."
        value={input}
        onChangeText={setInput}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  message: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
    maxWidth: "80%",
  },

  userMessage: {
    backgroundColor: "#D6EAF8",
    alignSelf: "flex-end",
  },

  piperMessage: {
    backgroundColor: "#F2F2F2",
    alignSelf: "flex-start",
  },

  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 10,
  },

  chip: {
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  chipText: {
    fontSize: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});
