import { RecurringTransaction, Transaction } from "@/interfaces/transaction";
import { api } from "@/lib/utils";

export async function useCreateTransaction(
  TransactionData: Transaction
): Promise<Transaction | null> {
  try {
    const newTransaction: Transaction = await api
      .post("transactions", { json: TransactionData })
      .json();

    console.log("new>", newTransaction);

    return newTransaction;
  } catch (error) {
    console.error("Erro ao criar nova transação:", error);
    return null;
  }
}

export async function useCreateRecurringTransaction(
  RecurringTransactionData: RecurringTransaction
): Promise<RecurringTransaction | null> {
  try {
    const newRecurringTransaction: RecurringTransaction = await api
      .post("recurringTransactions", { json: RecurringTransactionData })
      .json();

    return newRecurringTransaction;
  } catch (error) {
    console.log(error);
    return null;
  }
}
