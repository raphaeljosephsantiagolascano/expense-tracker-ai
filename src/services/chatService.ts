import { Expense } from "@/types/expense";
import { GroceryItem } from "@/types/groceryItem";
import { SavingsGoal } from "@/types/savingsGoal";
import { SplitBill } from "@/types/splitBill";
import {
  canAffordAmount,
  canAffordGroceries,
  extractAffordabilityAmount,
} from "./affordabilityService";
import {
  calculateGroceryBudgetImpact,
  summarizeGroceries,
} from "./groceryService";
import { getInsights } from "./insightService";
import { summarizeSplitBills } from "./splitBillService";
import { summarizeTrackingStreak } from "./streakService";

export function getPiperResponse(
  message: string,
  expenses: Expense[],
  budget: number,
  goals: SavingsGoal[],
  splitBills: SplitBill[],
  groceries: GroceryItem[],
): string {
  const lower = message.toLowerCase();

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budget - totalSpent;

  if (lower.includes("how much did i spend") && !lower.includes("food")) {
    return `You spent ₱${totalSpent.toFixed(2)} this month.`;
  }

  if (lower.includes("show my groceries") || lower.includes("grocery list")) {
    return summarizeGroceries(groceries);
  }

  if (
    lower.includes("how much are my groceries") ||
    lower.includes("grocery cost")
  ) {
    const impact = calculateGroceryBudgetImpact(groceries, remainingBudget);

    return `Your grocery list totals ₱${impact.totalCost.toFixed(
      2,
    )}. Pending groceries total ₱${impact.unpurchasedCost.toFixed(2)}.`;
  }

  if (
    lower.includes("can i afford my grocery") ||
    lower.includes("can i afford groceries")
  ) {
    const result = canAffordGroceries(groceries, remainingBudget);

    if (result.canAfford) {
      return `Yes. Your pending groceries cost ₱${result.amount.toFixed(
        2,
      )}, leaving ₱${result.remainingAfterPurchase.toFixed(2)}.`;
    }

    return `Not yet. Your pending groceries cost ₱${result.amount.toFixed(
      2,
    )}, which is ₱${Math.abs(result.remainingAfterPurchase).toFixed(
      2,
    )} over your remaining budget.`;
  }

  if (lower.includes("can i afford")) {
    const amount = extractAffordabilityAmount(message);

    if (amount !== null) {
      const result = canAffordAmount(amount, remainingBudget);

      if (result.canAfford) {
        return `Yes. ₱${amount.toFixed(2)} fits your remaining budget, leaving ₱${result.remainingAfterPurchase.toFixed(2)}.`;
      }

      return `Not comfortably. ₱${amount.toFixed(
        2,
      )} is ₱${Math.abs(result.remainingAfterPurchase).toFixed(
        2,
      )} over your remaining budget.`;
    }
  }

  if (lower.includes("food")) {
    const foodSpent = expenses
      .filter((expense) => expense.category === "Food")
      .reduce((sum, expense) => sum + expense.amount, 0);

    return `You spent ₱${foodSpent.toFixed(2)} on Food.`;
  }

  if (lower.includes("budget") || lower.includes("over budget")) {
    if (totalSpent > budget) {
      return `⚠️ You are over budget by ₱${(totalSpent - budget).toFixed(2)}.`;
    }

    return `✅ You still have ₱${(budget - totalSpent).toFixed(2)} remaining.`;
  }

  if (
    lower.includes("biggest category") ||
    lower.includes("largest category")
  ) {
    const categories: Record<string, number> = {};

    expenses.forEach((expense) => {
      categories[expense.category] =
        (categories[expense.category] || 0) + expense.amount;
    });

    let biggest = "";
    let amount = 0;

    Object.entries(categories).forEach(([category, total]) => {
      if (total > amount) {
        biggest = category;
        amount = total;
      }
    });

    return `${biggest} is your biggest category at ₱${amount.toFixed(2)}.`;
  }
  if (lower.includes("insight") || lower.includes("analysis")) {
    return getInsights(expenses, budget, goals).join("\n");
  }
  if (lower.includes("goal") || lower.includes("savings")) {
    if (goals.length === 0) {
      return "You currently have no savings goals.";
    }

    return goals
      .map((goal) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;

        return `${goal.title}: ${progress.toFixed(0)}% complete`;
      })
      .join("\n");
  }
  if (lower.includes("streak") || lower.includes("tracking streak")) {
    return `🔥 ${summarizeTrackingStreak(expenses)}`;
  }
  if (lower.includes("split bill") || lower.includes("split bills")) {
    return summarizeSplitBills(splitBills);
  }
  return "I'm still learning. Try asking about spending, budget, groceries, streaks, or categories.";
}
