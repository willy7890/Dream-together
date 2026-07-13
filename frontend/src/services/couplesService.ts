import { api } from "./api";

export interface MyCouple {
  partnered: boolean;
  id?: number;
  relationship_status?: string;
  anniversary_date?: string | null;
  workspace_type: "solo" | "couple" | "family" | null;
}

export async function sendInvite(invitee_email: string) {
  const res = await api.post("/couples/invite", { invitee_email });
  return res.data;
}

export async function pendingInvites() {
  const res = await api.get("/couples/pending");
  return res.data as { id: number; inviter_name: string; invitee_email: string }[];
}

export async function acceptInvite(invitationId: number) {
  const res = await api.post(`/couples/accept/${invitationId}`);
  return res.data;
}

export async function myCouple(): Promise<MyCouple> {
  const res = await api.get("/couples/me");
  return res.data;
}

export async function setWorkspaceType(workspace_type: "solo" | "couple" | "family") {
  const res = await api.patch("/couples/workspace-type", { workspace_type });
  return res.data;
}
