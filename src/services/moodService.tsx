export type PiperMood = "happy" | "neutral" | "concerned" | "warning";

export function getPiperMood(totalSpent: number, budget: number): PiperMood {
  if (budget <= 0) return "neutral";

  const percentage = (totalSpent / budget) * 100;

  if (percentage < 50) return "happy";
  if (percentage < 80) return "neutral";
  if (percentage <= 100) return "concerned";

  return "warning";
}
