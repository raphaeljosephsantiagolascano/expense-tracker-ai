export type ParsedExpense = {
  amount: number;
  description: string;
  category: string;
};

export function parseExpenseText(text: string): ParsedExpense | null {
  const lower = text.toLowerCase();

  const amountMatch = text.match(/\d+(\.\d+)?/);

  if (!amountMatch) return null;

  const amount = Number(amountMatch[0]);

  let description = text
    .replace(amountMatch[0], "")
    .replace(/spent/i, "")
    .replace(/on/i, "")
    .trim();

  if (!description) {
    description = "Expense";
  }

  let category = "Other";

  if (
    lower.includes("jollibee") ||
    lower.includes("mcdo") ||
    lower.includes("food") ||
    lower.includes("lunch") ||
    lower.includes("dinner") ||
    lower.includes("breakfast")
  ) {
    category = "Food";
  } else if (
    lower.includes("gas") ||
    lower.includes("fuel") ||
    lower.includes("grab") ||
    lower.includes("taxi") ||
    lower.includes("jeep")
  ) {
    category = "Transportation";
  } else if (
    lower.includes("netflix") ||
    lower.includes("spotify") ||
    lower.includes("movie")
  ) {
    category = "Entertainment";
  } else if (
    lower.includes("electric") ||
    lower.includes("water") ||
    lower.includes("internet")
  ) {
    category = "Bills";
  }

  return {
    amount,
    description,
    category,
  };
}
