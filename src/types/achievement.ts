export type AchievementId =
  | "first-expense"
  | "seven-day-streak"
  | "thirty-day-streak"
  | "first-savings-goal"
  | "one-hundred-expenses"
  | "first-grocery-scan"
  | "first-split-bill"
  | "budget-master";

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
};
