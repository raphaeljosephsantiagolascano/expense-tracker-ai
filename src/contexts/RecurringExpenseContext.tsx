import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { RecurringExpense } from "@/types/recurringExpense";

type RecurringExpenseContextType = {
  recurringExpenses: RecurringExpense[];
  addRecurringExpense: (expense: RecurringExpense) => void;
  deleteRecurringExpense: (id: string) => void;
  replaceRecurringExpenses: (expenses: RecurringExpense[]) => void;
};

const RecurringExpenseContext = createContext<
  RecurringExpenseContextType | undefined
>(undefined);

export function RecurringExpenseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpense[]
  >([]);

  useEffect(() => {
    loadRecurringExpenses();
  }, []);

  useEffect(() => {
    saveRecurringExpenses();
  }, [recurringExpenses]);

  const loadRecurringExpenses = async () => {
    try {
      const stored = await AsyncStorage.getItem("recurringExpenses");

      if (stored) {
        setRecurringExpenses(JSON.parse(stored));
      }
    } catch (error) {
      console.log("Error loading recurring expenses", error);
    }
  };

  const saveRecurringExpenses = async () => {
    try {
      await AsyncStorage.setItem(
        "recurringExpenses",
        JSON.stringify(recurringExpenses),
      );
    } catch (error) {
      console.log("Error saving recurring expenses", error);
    }
  };

  const addRecurringExpense = (expense: RecurringExpense) => {
    setRecurringExpenses((prev) => [expense, ...prev]);
  };

  const deleteRecurringExpense = (id: string) => {
    setRecurringExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const replaceRecurringExpenses = (expenses: RecurringExpense[]) => {
    setRecurringExpenses(expenses);
  };

  return (
    <RecurringExpenseContext.Provider
      value={{
        recurringExpenses,
        addRecurringExpense,
        deleteRecurringExpense,
        replaceRecurringExpenses,
      }}
    >
      {children}
    </RecurringExpenseContext.Provider>
  );
}

export function useRecurringExpenses() {
  const context = useContext(RecurringExpenseContext);

  if (!context) {
    throw new Error(
      "useRecurringExpenses must be used within RecurringExpenseProvider",
    );
  }

  return context;
}
