import { Expense } from "@/types/expense";
import { SavingsGoal } from "@/types/savingsGoal";
import { PiperMood } from "./moodService";

export function getInsights(
  expenses: Expense[],
  budget: number,
  goals: SavingsGoal[] = [],
): string[] {
  const insights: string[] = [];

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0) {
    return ["Start tracking expenses to receive insights."];
  }

  const categories: Record<string, number> = {};

  expenses.forEach((expense) => {
    categories[expense.category] =
      (categories[expense.category] || 0) + expense.amount;
  });

  let biggestCategory = "";
  let biggestAmount = 0;

  Object.entries(categories).forEach(([category, amount]) => {
    if (amount > biggestAmount) {
      biggestCategory = category;
      biggestAmount = amount;
    }
  });

  insights.push(
    `Your highest spending category is ${biggestCategory} (₱${biggestAmount.toFixed(
      2,
    )}).`,
  );

  const usagePercent = budget > 0 ? (totalSpent / budget) * 100 : 0;

  if (usagePercent >= 80) {
    insights.push("⚠️ You have used over 80% of your budget.");
  } else {
    insights.push(`✅ Budget usage is ${usagePercent.toFixed(0)}%`);
  }

  if (expenses.length >= 2) {
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const midpoint = Math.ceil(sortedExpenses.length / 2);
    const earlierTotal = sortedExpenses
      .slice(0, midpoint)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const recentTotal = sortedExpenses
      .slice(midpoint)
      .reduce((sum, expense) => sum + expense.amount, 0);

    if (recentTotal > earlierTotal) {
      insights.push("Spending is trending upward compared with earlier entries.");
    } else if (recentTotal < earlierTotal) {
      insights.push("Spending is trending downward compared with earlier entries.");
    }
  }

  goals.forEach((goal) => {
    if (goal.targetAmount <= 0) return;

    const remainingGoalAmount = goal.targetAmount - goal.currentAmount;

    if (remainingGoalAmount > 0 && budget > totalSpent) {
      insights.push(
        `Consider moving part of your ₱${(budget - totalSpent).toFixed(
          2,
        )} remaining budget toward ${goal.title}.`,
      );
    }
  });

  return insights;
}

export function getPiperMessage(mood: PiperMood): string {
  switch (mood) {
    case "happy":
      return "Great job! You're spending responsibly.";

    case "neutral":
      return "Everything looks balanced so far.";

    case "concerned":
      return "You're getting close to your budget limit.";

    case "warning":
      return "You've exceeded your budget.";

    default:
      return "Let's keep tracking your expenses.";
  }
}
