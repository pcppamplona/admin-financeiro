export interface Category {
    id: number;
    userId: number;
    name: string;
    type: "expense" | "income";
    color: string;
    icon?: string;
    budgetLimit: number | null;
    parentId: number | null;
    createdAt: string;
  }