import { api } from "./api";

export interface FamilyMember {
  id: number;
  full_name: string;
  relation: "child" | "parent" | "other";
  age: number | null;
  avatar_color: string;
}

export const listFamilyMembers = async (): Promise<FamilyMember[]> => (await api.get("/family/members")).data;
export const addFamilyMember = async (payload: Partial<FamilyMember>): Promise<FamilyMember> =>
  (await api.post("/family/members", payload)).data;
export const deleteFamilyMember = async (id: number): Promise<void> => { await api.delete(`/family/members/${id}`); };
