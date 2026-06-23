import { GroceryItem } from "@/types/groceryItem";

export function calculateGroceryTotal(items: GroceryItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.estimatedPrice, 0);
}

export function calculateUnpurchasedGroceryTotal(items: GroceryItem[]): number {
  return items
    .filter((item) => !item.purchased)
    .reduce((sum, item) => sum + item.quantity * item.estimatedPrice, 0);
}

export function calculateGroceryBudgetImpact(
  items: GroceryItem[],
  remainingBudget: number,
) {
  const totalCost = calculateGroceryTotal(items);
  const unpurchasedCost = calculateUnpurchasedGroceryTotal(items);

  return {
    totalCost,
    unpurchasedCost,
    remainingAfterGroceries: remainingBudget - unpurchasedCost,
    canAfford: unpurchasedCost <= remainingBudget,
  };
}

export function summarizeGroceries(items: GroceryItem[]): string {
  if (items.length === 0) {
    return "Your grocery list is empty.";
  }

  return items
    .map((item) => {
      const status = item.purchased ? "purchased" : "pending";
      const total = item.quantity * item.estimatedPrice;
      const category = item.category ? `, ${item.category}` : "";

      return `${item.name} x${item.quantity}: ₱${total.toFixed(
        2,
      )} (${status}${category})`;
    })
    .join("\n");
}

export function summarizeUnpurchasedGroceries(items: GroceryItem[]): string {
  const pendingItems = items.filter((item) => !item.purchased);

  if (pendingItems.length === 0) {
    return "All grocery items are marked as purchased.";
  }

  return pendingItems
    .map((item) => {
      const total = item.quantity * item.estimatedPrice;

      return `${item.name} x${item.quantity}: ₱${total.toFixed(2)}`;
    })
    .join("\n");
}
