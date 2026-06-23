export function calculateProjectedSpending(dailySpend: number) {
  const projectedMonthly = dailySpend * 30;

  return {
    projectedMonthly,
  };
}
