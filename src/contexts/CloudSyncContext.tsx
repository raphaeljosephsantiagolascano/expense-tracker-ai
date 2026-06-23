import React, { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useGroceries } from "@/contexts/GroceryContext";
import { useRecurringExpenses } from "@/contexts/RecurringExpenseContext";
import { useSavingsGoals } from "@/contexts/SavingsGoalContext";
import { useSplitBills } from "@/contexts/SplitBillContext";
import {
  pullItemsFromCloud,
  pushItemsToCloud,
} from "@/services/cloudSyncService";
import { Expense } from "@/types/expense";
import { GroceryItem } from "@/types/groceryItem";
import { RecurringExpense } from "@/types/recurringExpense";
import { SavingsGoal } from "@/types/savingsGoal";
import { SplitBill } from "@/types/splitBill";

type CloudSyncContextType = {
  syncing: boolean;
  error: string;
  lastSyncedAt: string | null;
  syncNow: () => Promise<void>;
};

const CloudSyncContext = createContext<CloudSyncContextType | undefined>(
  undefined,
);

export function CloudSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isConfigured } = useAuth();
  const { expenses, replaceExpenses } = useExpenses();
  const { goals, replaceGoals } = useSavingsGoals();
  const { groceryItems, replaceGroceryItems } = useGroceries();
  const { splitBills, replaceSplitBills } = useSplitBills();
  const { recurringExpenses, replaceRecurringExpenses } =
    useRecurringExpenses();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const syncNow = async () => {
    if (!user || !isConfigured) {
      setError("Sign in and configure Supabase to enable cloud sync.");
      return;
    }

    setSyncing(true);
    setError("");

    try {
      await pushItemsToCloud("expenses", user.id, expenses);
      await pushItemsToCloud("savings_goals", user.id, goals);
      await pushItemsToCloud("grocery_items", user.id, groceryItems);
      await pushItemsToCloud("split_bills", user.id, splitBills);
      await pushItemsToCloud("recurring_expenses", user.id, recurringExpenses);
      setLastSyncedAt(new Date().toISOString());
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : "Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (!user || !isConfigured) return;

    const hydrateFromCloud = async () => {
      setSyncing(true);
      setError("");

      try {
        const [
          cloudExpenses,
          cloudGoals,
          cloudGroceries,
          cloudSplitBills,
          cloudRecurringExpenses,
        ] = await Promise.all([
          pullItemsFromCloud<Expense>("expenses", user.id),
          pullItemsFromCloud<SavingsGoal>("savings_goals", user.id),
          pullItemsFromCloud<GroceryItem>("grocery_items", user.id),
          pullItemsFromCloud<SplitBill>("split_bills", user.id),
          pullItemsFromCloud<RecurringExpense>("recurring_expenses", user.id),
        ]);

        if (cloudExpenses.length > 0) replaceExpenses(cloudExpenses);
        if (cloudGoals.length > 0) replaceGoals(cloudGoals);
        if (cloudGroceries.length > 0) replaceGroceryItems(cloudGroceries);
        if (cloudSplitBills.length > 0) replaceSplitBills(cloudSplitBills);
        if (cloudRecurringExpenses.length > 0) {
          replaceRecurringExpenses(cloudRecurringExpenses);
        }

        await syncNow();
      } catch (syncError) {
        setError(syncError instanceof Error ? syncError.message : "Sync failed.");
      } finally {
        setSyncing(false);
      }
    };

    hydrateFromCloud();
  }, [user]);

  return (
    <CloudSyncContext.Provider value={{ syncing, error, lastSyncedAt, syncNow }}>
      {children}
    </CloudSyncContext.Provider>
  );
}

export function useCloudSync() {
  const context = useContext(CloudSyncContext);

  if (!context) {
    throw new Error("useCloudSync must be used within CloudSyncProvider");
  }

  return context;
}
