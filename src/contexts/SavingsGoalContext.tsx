import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { SavingsGoal } from "@/types/savingsGoal";

type SavingsGoalContextType = {
  goals: SavingsGoal[];
  addGoal: (goal: SavingsGoal) => void;
  deleteGoal: (id: string) => void;
  replaceGoals: (goals: SavingsGoal[]) => void;
};

const SavingsGoalContext = createContext<SavingsGoalContextType | undefined>(
  undefined,
);

export function SavingsGoalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    saveGoals();
  }, [goals]);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem("goals");

      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.log("Error loading goals", error);
    }
  };

  const saveGoals = async () => {
    try {
      await AsyncStorage.setItem("goals", JSON.stringify(goals));
    } catch (error) {
      console.log("Error saving goals", error);
    }
  };

  const addGoal = (goal: SavingsGoal) => {
    setGoals((prev) => [goal, ...prev]);
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const replaceGoals = (nextGoals: SavingsGoal[]) => {
    setGoals(nextGoals);
  };

  return (
    <SavingsGoalContext.Provider
      value={{
        goals,
        addGoal,
        deleteGoal,
        replaceGoals,
      }}
    >
      {children}
    </SavingsGoalContext.Provider>
  );
}

export function useSavingsGoals() {
  const context = useContext(SavingsGoalContext);

  if (!context) {
    throw new Error("useSavingsGoals must be used within SavingsGoalProvider");
  }

  return context;
}
