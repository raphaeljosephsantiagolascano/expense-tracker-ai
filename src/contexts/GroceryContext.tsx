import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { GroceryItem } from "@/types/groceryItem";

type GroceryContextType = {
  groceryItems: GroceryItem[];
  addGroceryItem: (item: GroceryItem) => void;
  updateGroceryItem: (item: GroceryItem) => void;
  deleteGroceryItem: (id: string) => void;
  togglePurchased: (id: string) => void;
};

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export function GroceryProvider({ children }: { children: React.ReactNode }) {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);

  useEffect(() => {
    loadGroceryItems();
  }, []);

  useEffect(() => {
    saveGroceryItems();
  }, [groceryItems]);

  const loadGroceryItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("groceryItems");

      if (storedItems) {
        setGroceryItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.log("Error loading grocery items", error);
    }
  };

  const saveGroceryItems = async () => {
    try {
      await AsyncStorage.setItem("groceryItems", JSON.stringify(groceryItems));
    } catch (error) {
      console.log("Error saving grocery items", error);
    }
  };

  const addGroceryItem = (item: GroceryItem) => {
    setGroceryItems((prev) => [item, ...prev]);
  };

  const updateGroceryItem = (updatedItem: GroceryItem) => {
    setGroceryItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  };

  const deleteGroceryItem = (id: string) => {
    setGroceryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const togglePurchased = (id: string) => {
    setGroceryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item,
      ),
    );
  };

  return (
    <GroceryContext.Provider
      value={{
        groceryItems,
        addGroceryItem,
        updateGroceryItem,
        deleteGroceryItem,
        togglePurchased,
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
}

export function useGroceries() {
  const context = useContext(GroceryContext);

  if (!context) {
    throw new Error("useGroceries must be used within GroceryProvider");
  }

  return context;
}
