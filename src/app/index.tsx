import { StyleSheet, Text, View } from "react-native";

import InfoLabel from "@/components/InfoLabel";
import PiperCard from "@/components/PiperCard";
import { useBudget } from "@/contexts/BudgetContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useRecurringExpenses } from "@/contexts/RecurringExpenseContext";
import { useSavingsGoals } from "@/contexts/SavingsGoalContext";
import { generateBriefing } from "@/services/briefingService";
import { calculateForecast } from "@/services/forecastService";
import { getPiperMessage } from "@/services/insightService";
import { getPiperMood } from "@/services/moodService";
import { calculateTrackingStreak } from "@/services/streakService";

export default function HomeScreen() {
  const { expenses } = useExpenses();
  const { budget } = useBudget();
  const { goals } = useSavingsGoals();
  const { recurringExpenses } = useRecurringExpenses();
  const trackingStreak = calculateTrackingStreak(expenses);
  const briefing = generateBriefing(expenses, budget, goals, recurringExpenses);
  const forecast = calculateForecast(expenses, budget);
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = budget - totalSpent;
  const mood = getPiperMood(totalSpent, budget);
  const message = getPiperMessage(mood);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pocket Pilot</Text>

      <PiperCard mood={mood} message={message} />

      <View style={styles.card}>
        <InfoLabel
          label="Monthly Budget"
          description="The maximum amount you plan to spend this month."
        />

        <Text style={styles.value}>₱{budget.toLocaleString()}</Text>
      </View>

      <View style={styles.card}>
        <InfoLabel
          label="Total Spent"
          description="The total of all expenses you've recorded this month."
        />

        <Text style={styles.value}>₱{totalSpent.toLocaleString()}</Text>
      </View>

      <View style={styles.card}>
        <InfoLabel
          label="Remaining"
          description="The amount left before reaching your monthly budget."
        />

        <Text style={styles.value}>₱{remaining.toLocaleString()}</Text>
      </View>

      <View style={styles.card}>
        <InfoLabel
          label="Daily Average"
          description="Average amount spent per day based on your recorded expenses this month."
        />

        <Text style={styles.value}>₱{forecast.dailyAverage.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <InfoLabel
          label="Projected Monthly Spending"
          description="An estimate of how much you'll spend by the end of the month if current spending continues."
        />

        <Text style={styles.value}>
          ₱{forecast.projectedMonthlySpend.toFixed(2)}
        </Text>
      </View>

      <View style={styles.card}>
        <InfoLabel
          label="Projected Savings"
          description="Estimated money remaining after projected spending is deducted from your budget."
        />

        <Text style={styles.value}>
          ₱{forecast.projectedSavings.toFixed(2)}
        </Text>
      </View>
      <View style={styles.briefingCard}>
        <Text style={styles.briefingTitle}>👋 Piper Daily Briefing</Text>

        <Text>Budget Remaining: ₱{briefing.remainingBudget.toFixed(2)}</Text>

        <Text>Total Spent: ₱{briefing.totalSpent.toFixed(2)}</Text>

        <Text>
          Top Category:
          {briefing.topCategory}
        </Text>

        <Text>
          Mood:
          {briefing.mood}
        </Text>

        {briefing.primaryGoal && (
          <Text>
            Goal:
            {briefing.primaryGoal.title} ({briefing.savingsGoalProgress.toFixed(
              0,
            )}
            %)
          </Text>
        )}

        <Text>Expense Streak: {briefing.expenseStreak} day(s)</Text>

        <Text>
          Due Soon:
          {briefing.dueSoonRecurringExpenses.length === 0
            ? " None"
            : ` ${briefing.dueSoonRecurringExpenses
                .map((expense) => expense.title)
                .join(", ")}`}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Tracking Streak</Text>
        <Text style={styles.value}>🔥 {trackingStreak} day(s)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  label: {
    color: "gray",
    marginBottom: 4,
  },

  value: {
    fontSize: 22,
    fontWeight: "bold",
  },
  briefingCard: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  briefingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
