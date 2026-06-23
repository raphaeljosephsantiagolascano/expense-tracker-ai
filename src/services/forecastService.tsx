import { Expense } from "@/types/expense";

export function calculateForecast(expenses: Expense[], budget: number) {
  if (expenses.length === 0) {
    return {
      dailyAverage: 0,
      projectedMonthlySpend: 0,
      projectedSavings: budget,
    };
  }

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const today = new Date();
  const currentDay = today.getDate();

  const dailyAverage = totalSpent / currentDay;

  const projectedMonthlySpend = dailyAverage * 30;

  const projectedSavings = budget - projectedMonthlySpend;

  return {
    dailyAverage,
    projectedMonthlySpend,
    projectedSavings,
  };
}
