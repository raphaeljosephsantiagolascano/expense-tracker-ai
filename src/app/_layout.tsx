import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { BudgetProvider } from "@/contexts/BudgetContext";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { GroceryProvider } from "@/contexts/GroceryContext";
import { RecurringExpenseProvider } from "@/contexts/RecurringExpenseContext";
import { SavingsGoalProvider } from "@/contexts/SavingsGoalContext";
import { SplitBillProvider } from "@/contexts/SplitBillContext";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SavingsGoalProvider>
        <BudgetProvider>
          <RecurringExpenseProvider>
            <SplitBillProvider>
              <GroceryProvider>
                <ExpenseProvider>
                  <AnimatedSplashOverlay />
                  <AppTabs />
                </ExpenseProvider>
              </GroceryProvider>
            </SplitBillProvider>
          </RecurringExpenseProvider>
        </BudgetProvider>
      </SavingsGoalProvider>
    </ThemeProvider>
  );
}
