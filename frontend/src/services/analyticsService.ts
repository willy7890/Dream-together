import { api } from "./api";

export interface DashboardStats {
  active_goals: number;
  completed_goals: number;
  memories_count: number;
  journal_count: number;
  total_saved: number;
}

export const getDashboard = async (): Promise<DashboardStats> => (await api.get("/analytics/dashboard")).data;
