import { api } from "./api";

export interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string | null;
  note: string | null;
  date: string;
}

export const listTransactions = async (): Promise<Transaction[]> => (await api.get("/savings/transactions")).data;
export const createTransaction = async (payload: Omit<Transaction, "id">): Promise<Transaction> =>
  (await api.post("/savings/transactions", payload)).data;
export const getSummary = async (): Promise<{ income: number; expenses: number; balance: number }> =>
  (await api.get("/savings/summary")).data;
