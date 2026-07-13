import { api } from "./api";

export interface AdminStats {
  total_users: number;
  total_couples: number;
  total_goals: number;
  total_memories: number;
}

export const getAdminStats = async (): Promise<AdminStats> => (await api.get("/admin/stats")).data;
