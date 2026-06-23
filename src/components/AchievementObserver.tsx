import { useEffect } from "react";

import { useAchievements } from "@/contexts/AchievementContext";
import { useBudget } from "@/contexts/BudgetContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useGroceries } from "@/contexts/GroceryContext";
import { useSavingsGoals } from "@/contexts/SavingsGoalContext";
import { useSplitBills } from "@/contexts/SplitBillContext";
import { evaluateAchievementUnlocks } from "@/services/achievementService";
import { calculateTrackingStreak } from "@/services/streakService";

export default function AchievementObserver() {
  const { achievements, unlock } = useAchievements();
  const { expenses } = useExpenses();
  const { goals } = useSavingsGoals();
  const { groceryItems } = useGroceries();
  const { splitBills } = useSplitBills();
  const { budget } = useBudget();

  useEffect(() => {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const ids = evaluateAchievementUnlocks({
      expenses,
      goals,
      groceries: groceryItems,
      splitBills,
      budget,
      totalSpent,
      expenseStreak: calculateTrackingStreak(expenses),
      achievements,
    });

    unlock(ids);
  }, [achievements, budget, expenses, goals, groceryItems, splitBills]);

  return null;
}
