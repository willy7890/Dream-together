import { api } from "./api";

export const reportContent = async (target_type: string, target_id: number, reason: string) =>
  (await api.post("/reports", { target_type, target_id, reason })).data;