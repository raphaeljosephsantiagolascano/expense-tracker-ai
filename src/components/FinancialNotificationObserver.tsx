import { useEffect, useRef } from "react";

import { useBudget } from "@/contexts/BudgetContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useRecurringExpenses } from "@/contexts/RecurringExpenseContext";
import { useSettings } from "@/contexts/SettingsContext";
import { getDueSoonRecurringExpenses } from "@/services/recurringExpenseService";
import {
  sendBudgetWarningNotification,
  sendRecurringReminderNotification,
} from "@/services/notificationService";

export default function FinancialNotificationObserver() {
  const { settings } = useSettings();
  const { budget } = useBudget();
  const { expenses } = useExpenses();
  const { recurringExpenses } = useRecurringExpenses();
  const sentKeys = useRef(new Set<string>());

  useEffect(() => {
    if (!settings.notifications.enabled) return;

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = budget - totalSpent;

    if (
      settings.notifications.budgetWarnings &&
      budget > 0 &&
      remainingBudget <= budget * 0.2 &&
      !sentKeys.current.has("budget-warning")
    ) {
      sentKeys.current.add("budget-warning");
      sendBudgetWarningNotification(remainingBudget);
    }
  }, [budget, expenses, settings.notifications]);

  useEffect(() => {
    if (
      !settings.notifications.enabled ||
      !settings.notifications.recurringReminders
    ) {
      return;
    }

    getDueSoonRecurringExpenses(recurringExpenses).forEach((expense) => {
      const key = `recurring-${expense.id}-${expense.nextDueDate}`;

      if (!sentKeys.current.has(key)) {
        sentKeys.current.add(key);
        sendRecurringReminderNotification(
          `${expense.title} is due soon: ₱${expense.amount.toFixed(2)}`,
        );
      }
    });
  }, [recurringExpenses, settings.notifications]);

  return null;
}
