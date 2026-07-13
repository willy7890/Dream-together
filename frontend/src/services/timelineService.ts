import { api } from "./api";

export interface TimelineEvent {
  id: number;
  label: string;
  description: string | null;
  date: string;
}

export const listEvents = async (): Promise<TimelineEvent[]> => (await api.get("/timeline")).data;
export const createEvent = async (payload: Partial<TimelineEvent>): Promise<TimelineEvent> =>
  (await api.post("/timeline", payload)).data;
