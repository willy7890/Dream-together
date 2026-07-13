import { api } from "./api";

export interface JournalEntry {
  id: number;
  author_id: number;
  title: string | null;
  mood: string | null;
  text: string;
  date: string;
}

export const listEntries = async (): Promise<JournalEntry[]> => (await api.get("/journals")).data;
export const createEntry = async (payload: Partial<JournalEntry>): Promise<JournalEntry> =>
  (await api.post("/journals", payload)).data;
