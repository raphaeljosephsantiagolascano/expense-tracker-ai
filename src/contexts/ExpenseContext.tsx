import { Expense } from "@/types/expense";
import React, { createContext, useContext, useState } from "react";

type ExpenseContextType = {
  expenses: Expense[];
  deleteExpense: (id: string) => void;
  addExpense: (expense: Expense) => void;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense: (id: string) => {
          setExpenses((prev) => prev.filter((expense) => expense.id !== id));
        },
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error("useExpenses must be used within ExpenseProvider");
  }

  return context;
}
