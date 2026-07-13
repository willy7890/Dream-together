import { api } from "./api";

export interface AppNotification {
  id: number;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
}

export const listNotifications = async (): Promise<AppNotification[]> => (await api.get("/notifications")).data;
export const markRead = async (id: number): Promise<AppNotification> => (await api.post(`/notifications/${id}/read`)).data;
