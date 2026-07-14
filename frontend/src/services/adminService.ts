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

export interface ContentReport {
  id: number;
  reporter_id: number;
  target_type: string;
  target_id: number;
  reason: string;
  status: string;
  created_at: string;
}

export interface AdminMemory {
  id: number;
  title: string;
  media_url: string | null;
  media_type: string;
  date: string;
  couple_id: number;
}

export const listReports = async (status?: string): Promise<ContentReport[]> =>
  (await api.get("/admin/reports", { params: status ? { status } : {} })).data;

export const resolveReport = async (id: number): Promise<ContentReport> =>
  (await api.post(`/admin/reports/${id}/resolve`)).data;

export const dismissReport = async (id: number): Promise<ContentReport> =>
  (await api.post(`/admin/reports/${id}/dismiss`)).data;

export const listAllMemories = async (): Promise<AdminMemory[]> => (await api.get("/admin/memories")).data;

export const adminDeleteMemory = async (id: number): Promise<void> => { await api.delete(`/admin/memories/${id}`); };