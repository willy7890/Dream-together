import { api } from "./api";

export interface User {
  id: number;
  full_name: string;
  email: string;
  language: string;
  theme: string;
  avatar_color: string;
  couple_id: number | null;
  is_verified: boolean;
  is_admin: boolean;
}

export async function register(full_name: string, email: string, password: string) {
  await api.post("/auth/register", { full_name, email, password });
}

export async function login(email: string, password: string): Promise<string> {
  const res = await api.post("/auth/login", { email, password });
  return res.data.access_token;
}

export async function fetchMe(): Promise<User> {
  const res = await api.get("/users/me");
  return res.data;
}

export async function updateMe(payload: Partial<Pick<User, "full_name" | "language" | "theme">>): Promise<User> {
  const res = await api.patch("/users/me", payload);
  return res.data;
}

export async function verifyEmail(token: string): Promise<User> {
  const res = await api.get(`/auth/verify-email/${token}`);
  return res.data;
}

export async function resendVerification(): Promise<void> {
  await api.post("/auth/resend-verification");
}
