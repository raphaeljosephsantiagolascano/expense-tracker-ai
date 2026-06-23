import { GroceryItem } from "@/types/groceryItem";
import { calculateUnpurchasedGroceryTotal } from "./groceryService";

export function calculateRemainingBudget(totalSpent: number, budget: number) {
  return budget - totalSpent;
}

export function canAffordAmount(amount: number, remainingBudget: number) {
  return {
    amount,
    remainingBudget,
    canAfford: amount <= remainingBudget,
    remainingAfterPurchase: remainingBudget - amount,
  };
}

export function canAffordGroceries(
  groceries: GroceryItem[],
  remainingBudget: number,
) {
  const amount = calculateUnpurchasedGroceryTotal(groceries);

  return canAffordAmount(amount, remainingBudget);
}

export function extractAffordabilityAmount(message: string): number | null {
  const match = message.match(/(?:afford|buy|spend)\s+₱?\s*(\d+(?:\.\d+)?)/i);

  if (!match) {
    return null;
  }

  const amount = Number(match[1]);

  return Number.isFinite(amount) ? amount : null;
}
