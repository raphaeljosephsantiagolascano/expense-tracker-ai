import { RecurringExpense } from "@/types/recurringExpense";

export function getDueSoonRecurringExpenses(
  recurringExpenses: RecurringExpense[],
  daysAhead = 3,
): RecurringExpense[] {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return recurringExpenses.filter((expense) => {
    const dueDate = new Date(expense.nextDueDate);

    if (Number.isNaN(dueDate.getTime())) {
      return false;
    }

    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    return diffDays >= 0 && diffDays <= daysAhead;
  });
}

export function summarizeDueSoonRecurringExpenses(
  recurringExpenses: RecurringExpense[],
): string {
  const dueSoon = getDueSoonRecurringExpenses(recurringExpenses);

  if (dueSoon.length === 0) {
    return "No recurring expenses are due soon.";
  }

  return dueSoon
    .map((expense) => `${expense.title}: ₱${expense.amount.toFixed(2)}`)
    .join("\n");
}
