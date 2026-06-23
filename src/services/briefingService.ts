import { Expense } from "@/types/expense";
import { RecurringExpense } from "@/types/recurringExpense";
import { SavingsGoal } from "@/types/savingsGoal";
import { getDueSoonRecurringExpenses } from "./recurringExpenseService";
import { calculateTrackingStreak } from "./streakService";

export function generateBriefing(
  expenses: Expense[],
  budget: number,
  goals: SavingsGoal[],
  recurringExpenses: RecurringExpense[] = [],
) {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const remainingBudget = budget - totalSpent;

  const categories: Record<string, number> = {};

  expenses.forEach((expense) => {
    categories[expense.category] =
      (categories[expense.category] || 0) + expense.amount;
  });

  let topCategory = "None";
  let topAmount = 0;

  Object.entries(categories).forEach(([category, amount]) => {
    if (amount > topAmount) {
      topCategory = category;
      topAmount = amount;
    }
  });

  const primaryGoal = goals.length > 0 ? goals[0] : null;
  const savingsGoalProgress =
    primaryGoal && primaryGoal.targetAmount > 0
      ? (primaryGoal.currentAmount / primaryGoal.targetAmount) * 100
      : 0;
  const expenseStreak = calculateTrackingStreak(expenses);
  const dueSoonRecurringExpenses =
    getDueSoonRecurringExpenses(recurringExpenses);

  let mood = "😐 Neutral";

  if (remainingBudget > budget * 0.5) {
    mood = "😊 Healthy Spending";
  }

  if (remainingBudget < budget * 0.2) {
    mood = "⚠️ Budget Running Low";
  }

  return {
    totalSpent,
    remainingBudget,
    topCategory,
    mood,
    primaryGoal,
    savingsGoalProgress,
    expenseStreak,
    dueSoonRecurringExpenses,
  };
}
