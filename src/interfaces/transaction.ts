export interface Transaction {
  id: number | string;
  userId: number;
  accountId: number;
  categoryId: number;
  amount: number;
  type: string;
  description: string;
  date: string;
  status: string;
  isRecurring: boolean;
  recurringId: number | null;
  notes: string;
  attachments: [];
  createdAt: string;
  updatedAt: string;
}

export interface RecurringTransaction {
  id: number | string;
  userId: number;
  accountId: number;
  categoryId: number;
  amount: number;
  type: "expense" | "income";
  description: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  dayOfMonth: number;
  isActive: boolean;
  lastProcessed: string;
  createdAt: string;
  updatedAt: string;
}
