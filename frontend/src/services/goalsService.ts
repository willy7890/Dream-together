import { api } from "./api";

export interface Goal {
  id: number;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  status: string;
  progress_pct: number;
  assigned_member_id: number | null;
}

export const listGoals = async (): Promise<Goal[]> => (await api.get("/goals")).data;
export const createGoal = async (payload: Partial<Goal>): Promise<Goal> => (await api.post("/goals", payload)).data;
export const updateGoal = async (id: number, payload: Partial<Goal>): Promise<Goal> =>
  (await api.patch(`/goals/${id}`, payload)).data;
export const deleteGoal = async (id: number): Promise<void> => { await api.delete(`/goals/${id}`); };
