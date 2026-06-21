import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ExpenseProvider>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ExpenseProvider>
    </ThemeProvider>
  );
}
