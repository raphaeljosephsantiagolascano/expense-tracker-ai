import AchievementObserver from "@/components/AchievementObserver";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import FinancialNotificationObserver from "@/components/FinancialNotificationObserver";
import { AchievementProvider } from "@/contexts/AchievementContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BudgetProvider } from "@/contexts/BudgetContext";
import { CloudSyncProvider } from "@/contexts/CloudSyncContext";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { GroceryProvider } from "@/contexts/GroceryContext";
import { RecurringExpenseProvider } from "@/contexts/RecurringExpenseContext";
import { SavingsGoalProvider } from "@/contexts/SavingsGoalContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { SplitBillProvider } from "@/contexts/SplitBillContext";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <SettingsProvider>
          <AchievementProvider>
            <SavingsGoalProvider>
              <BudgetProvider>
                <RecurringExpenseProvider>
                  <SplitBillProvider>
                    <GroceryProvider>
                      <ExpenseProvider>
                        <CloudSyncProvider>
                          <AchievementObserver />
                          <FinancialNotificationObserver />
                          <AnimatedSplashOverlay />
                          <AppTabs />
                        </CloudSyncProvider>
                      </ExpenseProvider>
                    </GroceryProvider>
                  </SplitBillProvider>
                </RecurringExpenseProvider>
              </BudgetProvider>
            </SavingsGoalProvider>
          </AchievementProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
