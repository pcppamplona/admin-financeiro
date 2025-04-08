import { Transaction } from "@/interfaces/transaction";

// tipagem dos items do graph
export interface GroupedChartData {
  month: string;
  income: number;
  expense: number;
}

export function groupTransactionsByMonth(
  transactions: Transaction[]
): GroupedChartData[] {
  const grouped: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`; 

    if (!grouped[key]) {
      grouped[key] = { income: 0, expense: 0 };
    }

    if (transaction.type === "income") {
      grouped[key].income += transaction.amount;
    } else if (transaction.type === "expense") {
      grouped[key].expense += transaction.amount;
    }
  });

  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const [yearA, monthA] = a.split("-").map(Number);
    const [yearB, monthB] = b.split("-").map(Number);

    return (
      new Date(yearA, monthA).getTime() - new Date(yearB, monthB).getTime()
    );
  });

  return sortedKeys.map((key) => {
    const [year, month] = key.split("-").map(Number);
    const monthName = new Date(year, month).toLocaleString("default", {
      month: "long",
    });

    return {
      month: `${monthName} ${year}`, // Ex: "janeiro 2024"
      income: grouped[key].income,
      expense: grouped[key].expense,
    };
  });
}
