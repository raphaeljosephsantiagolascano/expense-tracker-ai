import { SplitBill } from "@/types/splitBill";

export function summarizeSplitBills(splitBills: SplitBill[]) {
  if (splitBills.length === 0) {
    return "You have no split bills yet.";
  }

  return splitBills
    .map((bill) => {
      const share = bill.totalAmount / bill.participants;

      return `${bill.title}: ₱${share.toFixed(2)} each, paid by ${bill.paidBy}`;
    })
    .join("\n");
}
