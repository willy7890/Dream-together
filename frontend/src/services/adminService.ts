import { api } from "./api";

export interface AdminStats {
  total_users: number;
  total_couples: number;
  total_goals: number;
  total_memories: number;
}

export interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  is_admin: boolean;
  is_verified: boolean;
  couple_id: number | null;
}

export const getAdminStats = async (): Promise<AdminStats> => (await api.get("/admin/stats")).data;

export const listUsers = async (search?: string): Promise<AdminUser[]> =>
  (await api.get("/admin/users", { params: search ? { search } : {} })).data;

export const updateUser = async (id: number, payload: Partial<AdminUser>): Promise<AdminUser> =>
  (await api.patch(`/admin/users/${id}`, payload)).data;

export const deleteUser = async (id: number): Promise<void> => { await api.delete(`/admin/users/${id}`); };