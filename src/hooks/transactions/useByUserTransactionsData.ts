import { RecurringTransaction, Transaction } from "@/interfaces/transaction";
import { api } from "@/lib/utils";

export async function useByUserTransactionsData(
  userId: string
): Promise<Transaction[]> {
  try {
    const transactions: Transaction[] = await api
      .get(`transactions?userId=${userId}`)
      .json();

    // console.log("Transações recebidas:", transactions);
    return transactions;
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return [];
  }
}

export async function useByUserRecurringTransactionsData(userId: string) {
  try {
    const recurringTransactions = await api
      .get("recurringTransactions", { searchParams: { userId } })
      .json();
    return recurringTransactions;
  } catch (error) {
    console.error("Erro ao buscar transações recorrentes:", error);
    return [];
  }
}


export async function useByIdRecurringTransactionsData(id: string): Promise<RecurringTransaction | null> {
  try {
    const recurringTransaction: RecurringTransaction[] = await api
      .get("recurringTransactions", { searchParams: { id } })
      .json<RecurringTransaction[]>();

    return recurringTransaction.length ? recurringTransaction[0] : null;
  } catch (error) {
    console.error("Erro ao buscar transação recorrente pelo ID:", error);
    return null;
  }
}
