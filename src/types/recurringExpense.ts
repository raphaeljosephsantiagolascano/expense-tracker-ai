export type RecurringExpense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  frequency: "Monthly" | "Weekly";
  nextDueDate: string;
};
