import { api } from "./api";

export interface MoodEntry {
  id: number;
  user_id: number;
  mood: string;
  date: string;
}

export const moodHistory = async (): Promise<MoodEntry[]> => (await api.get("/mood/history")).data;
export const logMood = async (mood: string, date: string): Promise<MoodEntry> =>
  (await api.post("/mood", { mood, date })).data;
