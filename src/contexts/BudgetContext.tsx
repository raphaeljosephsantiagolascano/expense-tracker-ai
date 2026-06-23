import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type BudgetContextType = {
  budget: number;
  setBudget: (amount: number) => void;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [budget, setBudgetState] = useState(0);

  useEffect(() => {
    loadBudget();
  }, []);

  useEffect(() => {
    saveBudget();
  }, [budget]);

  const loadBudget = async () => {
    try {
      const storedBudget = await AsyncStorage.getItem("budget");

      if (storedBudget) {
        const parsedBudget = Number(storedBudget);

        if (Number.isFinite(parsedBudget) && parsedBudget >= 0) {
          setBudgetState(parsedBudget);
        }
      }
    } catch (error) {
      console.log("Error loading budget", error);
    }
  };

  const saveBudget = async () => {
    try {
      await AsyncStorage.setItem("budget", budget.toString());
    } catch (error) {
      console.log("Error saving budget", error);
    }
  };

  const setBudget = (amount: number) => {
    if (Number.isFinite(amount) && amount >= 0) {
      setBudgetState(amount);
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        budget,
        setBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);

  if (!context) {
    throw new Error("useBudget must be used within BudgetProvider");
  }

  return context;
}
