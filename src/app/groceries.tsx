import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
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
import { lookupProductByBarcode } from "@/services/productLookupService";
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
  const [barcode, setBarcode] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [category, setCategory] = useState("General");
  const [purchased, setPurchased] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [lastScannedBarcode, setLastScannedBarcode] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [permission, requestPermission] = useCameraPermissions();

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budget - totalSpent;
  const groceryImpact = calculateGroceryBudgetImpact(
    groceryItems,
    remainingBudget,
  );

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setBarcode("");
    setImage("");
    setQuantity("");
    setEstimatedPrice("");
    setCategory("General");
    setPurchased(false);
    setLookupError("");
  };

  const applyBarcodeResult = async (scannedBarcode: string) => {
    setBarcode(scannedBarcode);
    setLookupError("");
    setLookupLoading(true);

    try {
      const product = await lookupProductByBarcode(scannedBarcode);

      if (product) {
        setName(product.brand ? `${product.brand} ${product.name}` : product.name);
        setImage(product.image ?? "");
      } else {
        setLookupError("Product not found. Enter the product name manually.");
      }
    } catch {
      setLookupError("Product lookup failed. You can still enter the item manually.");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleStartScanner = async () => {
    setLookupError("");

    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        Alert.alert(
          "Camera Permission Needed",
          "Camera access is required to scan grocery barcodes.",
        );
        return;
      }
    }

    setLastScannedBarcode("");
    setScannerVisible(true);
  };

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (!data || lookupLoading || data === lastScannedBarcode) {
      return;
    }

    setLastScannedBarcode(data);
    setScannerVisible(false);
    applyBarcodeResult(data);
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
      barcode: barcode || undefined,
      image: image || undefined,
      quantity: parsedQuantity,
      estimatedPrice: parsedPrice,
      category,
      purchased,
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
    setBarcode(item.barcode ?? "");
    setImage(item.image ?? "");
    setQuantity(item.quantity.toString());
    setEstimatedPrice(item.estimatedPrice.toString());
    setCategory(item.category || "General");
    setPurchased(item.purchased);
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

      <TouchableOpacity style={styles.secondaryButton} onPress={handleStartScanner}>
        <Text style={styles.secondaryButtonText}>Scan Barcode</Text>
      </TouchableOpacity>

      {scannerVisible && (
        <View style={styles.scannerCard}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
            }}
          />
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setScannerVisible(false)}
          >
            <Text style={styles.secondaryButtonText}>Cancel Scan</Text>
          </TouchableOpacity>
        </View>
      )}

      {lookupLoading && <Text style={styles.statusText}>Looking up product...</Text>}

      {lookupError && <Text style={styles.errorText}>{lookupError}</Text>}

      {barcode && <Text style={styles.statusText}>Scanned Barcode: {barcode}</Text>}

      {image && <Image source={{ uri: image }} style={styles.productImage} />}

      <TextInput
        placeholder="Item name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Barcode"
        value={barcode}
        onChangeText={setBarcode}
        keyboardType="numeric"
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

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setPurchased((current) => !current)}
      >
        <Text style={styles.checkbox}>{purchased ? "☑" : "☐"}</Text>
        <Text>Purchased</Text>
      </TouchableOpacity>

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
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.productImage} />
              )}
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
              <Text>Category: {item.category || "General"}</Text>
              {item.barcode && <Text>Barcode: {item.barcode}</Text>}
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
  scannerCard: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  camera: {
    height: 220,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  statusText: {
    marginBottom: 10,
    color: "gray",
  },
  errorText: {
    marginBottom: 10,
    color: "#B00020",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
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
