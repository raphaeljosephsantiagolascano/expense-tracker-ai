import { Expense } from "@/types/expense";

export function calculateTrackingStreak(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;

  const uniqueDates = Array.from(
    new Set(expenses.map((expense) => new Date(expense.date).toDateString())),
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (uniqueDates[i] === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function summarizeTrackingStreak(expenses: Expense[]): string {
  const streak = calculateTrackingStreak(expenses);

  if (streak === 0) {
    return "You have not logged an expense today yet.";
  }

  return `Your current expense logging streak is ${streak} day(s).`;
}
