import { Achievement, AchievementId } from "@/types/achievement";
import { Expense } from "@/types/expense";
import { GroceryItem } from "@/types/groceryItem";
import { SavingsGoal } from "@/types/savingsGoal";
import { SplitBill } from "@/types/splitBill";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-expense",
    title: "First Expense",
    description: "Log your first expense.",
    unlocked: false,
  },
  {
    id: "seven-day-streak",
    title: "7 Day Streak",
    description: "Log expenses for 7 consecutive days.",
    unlocked: false,
  },
  {
    id: "thirty-day-streak",
    title: "30 Day Streak",
    description: "Log expenses for 30 consecutive days.",
    unlocked: false,
  },
  {
    id: "first-savings-goal",
    title: "First Savings Goal",
    description: "Create your first savings goal.",
    unlocked: false,
  },
  {
    id: "one-hundred-expenses",
    title: "100 Expenses Logged",
    description: "Log 100 expenses.",
    unlocked: false,
  },
  {
    id: "first-grocery-scan",
    title: "First Grocery Scan",
    description: "Scan a grocery barcode.",
    unlocked: false,
  },
  {
    id: "first-split-bill",
    title: "First Split Bill",
    description: "Create your first split bill.",
    unlocked: false,
  },
  {
    id: "budget-master",
    title: "Budget Master",
    description: "Keep spending under 80% of your budget.",
    unlocked: false,
  },
];

export function createDefaultAchievements(): Achievement[] {
  return ACHIEVEMENTS.map((achievement) => ({ ...achievement }));
}

export function evaluateAchievementUnlocks({
  expenses,
  goals,
  groceries,
  splitBills,
  budget,
  totalSpent,
  expenseStreak,
  achievements,
}: {
  expenses: Expense[];
  goals: SavingsGoal[];
  groceries: GroceryItem[];
  splitBills: SplitBill[];
  budget: number;
  totalSpent: number;
  expenseStreak: number;
  achievements: Achievement[];
}): AchievementId[] {
  const unlocked = new Set(
    achievements
      .filter((achievement) => achievement.unlocked)
      .map((achievement) => achievement.id),
  );
  const candidates: Array<[AchievementId, boolean]> = [
    ["first-expense", expenses.length > 0],
    ["seven-day-streak", expenseStreak >= 7],
    ["thirty-day-streak", expenseStreak >= 30],
    ["first-savings-goal", goals.length > 0],
    ["one-hundred-expenses", expenses.length >= 100],
    ["first-grocery-scan", groceries.some((item) => Boolean(item.barcode))],
    ["first-split-bill", splitBills.length > 0],
    ["budget-master", budget > 0 && totalSpent <= budget * 0.8],
  ];

  return candidates
    .filter(([id, shouldUnlock]) => shouldUnlock && !unlocked.has(id))
    .map(([id]) => id);
}

export function unlockAchievements(
  achievements: Achievement[],
  ids: AchievementId[],
): Achievement[] {
  const now = new Date().toISOString();
  const idsToUnlock = new Set(ids);

  return achievements.map((achievement) =>
    idsToUnlock.has(achievement.id)
      ? { ...achievement, unlocked: true, unlockedAt: now }
      : achievement,
  );
}
