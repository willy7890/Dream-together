import { api } from "./api";

export interface Memory {
  id: number;
  title: string;
  description: string | null;
  media_url: string | null;
  media_type: string;
  date: string;
  location: string | null;
  tags: string | null;
}

export const listMemories = async (): Promise<Memory[]> => (await api.get("/memories")).data;
export const createMemory = async (payload: Partial<Memory>): Promise<Memory> => (await api.post("/memories", payload)).data;
export const deleteMemory = async (id: number): Promise<void> => { await api.delete(`/memories/${id}`); };

export const uploadFile = async (file: File): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/memories/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
