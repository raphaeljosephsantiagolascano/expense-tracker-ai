import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { SplitBill } from "@/types/splitBill";

type SplitBillContextType = {
  splitBills: SplitBill[];
  addSplitBill: (bill: SplitBill) => void;
  deleteSplitBill: (id: string) => void;
  replaceSplitBills: (bills: SplitBill[]) => void;
};

const SplitBillContext = createContext<SplitBillContextType | undefined>(
  undefined,
);

export function SplitBillProvider({ children }: { children: React.ReactNode }) {
  const [splitBills, setSplitBills] = useState<SplitBill[]>([]);

  useEffect(() => {
    loadSplitBills();
  }, []);

  useEffect(() => {
    saveSplitBills();
  }, [splitBills]);

  const loadSplitBills = async () => {
    try {
      const stored = await AsyncStorage.getItem("splitBills");

      if (stored) {
        setSplitBills(JSON.parse(stored));
      }
    } catch (error) {
      console.log("Error loading split bills", error);
    }
  };

  const saveSplitBills = async () => {
    try {
      await AsyncStorage.setItem("splitBills", JSON.stringify(splitBills));
    } catch (error) {
      console.log("Error saving split bills", error);
    }
  };

  const addSplitBill = (bill: SplitBill) => {
    setSplitBills((prev) => [bill, ...prev]);
  };

  const deleteSplitBill = (id: string) => {
    setSplitBills((prev) => prev.filter((bill) => bill.id !== id));
  };

  const replaceSplitBills = (bills: SplitBill[]) => {
    setSplitBills(bills);
  };

  return (
    <SplitBillContext.Provider
      value={{
        splitBills,
        addSplitBill,
        deleteSplitBill,
        replaceSplitBills,
      }}
    >
      {children}
    </SplitBillContext.Provider>
  );
}

export function useSplitBills() {
  const context = useContext(SplitBillContext);

  if (!context) {
    throw new Error("useSplitBills must be used within SplitBillProvider");
  }

  return context;
}
