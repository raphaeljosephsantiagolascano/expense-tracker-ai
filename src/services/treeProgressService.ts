import { Expense } from "@/types/expense";
import { SavingsGoal } from "@/types/savingsGoal";

export type TreeLevel =
  | "Seed"
  | "Sprout"
  | "Sapling"
  | "Young Tree"
  | "Blooming Tree"
  | "Fruit Tree"
  | "Legendary Tree";

export type TreeProgress = {
  level: number;
  label: TreeLevel;
  score: number;
  progressToNextLevel: number;
};

const TREE_LEVELS: TreeLevel[] = [
  "Seed",
  "Sprout",
  "Sapling",
  "Young Tree",
  "Blooming Tree",
  "Fruit Tree",
  "Legendary Tree",
];

export function calculateTreeProgress({
  expenseStreak,
  goals,
  budget,
  totalSpent,
  expenses,
}: {
  expenseStreak: number;
  goals: SavingsGoal[];
  budget: number;
  totalSpent: number;
  expenses: Expense[];
}): TreeProgress {
  const completedGoals = goals.filter(
    (goal) => goal.targetAmount > 0 && goal.currentAmount >= goal.targetAmount,
  ).length;
  const budgetHealth =
    budget <= 0 ? 0 : Math.max(0, Math.min(1, (budget - totalSpent) / budget));
  const score =
    Math.min(expenseStreak, 30) * 2 +
    completedGoals * 15 +
    Math.round(budgetHealth * 25) +
    Math.min(expenses.length, 100);
  const level = Math.min(7, Math.max(1, Math.floor(score / 30) + 1));
  const previousThreshold = (level - 1) * 30;
  const nextThreshold = level * 30;
  const progressToNextLevel =
    level >= 7
      ? 100
      : Math.min(
          100,
          Math.round(((score - previousThreshold) / (nextThreshold - previousThreshold)) * 100),
        );

  return {
    level,
    label: TREE_LEVELS[level - 1],
    score,
    progressToNextLevel,
  };
}
