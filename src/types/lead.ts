export interface Lead {
  id: string;
  name?: string;
  email: string;
  company?: string;
  phone?: string;
  teamSize?: string;
  message?: string;
  source: "waitlist" | "contact" | "demo" | "exit_intent";
  page: string;
  visitorId?: string;
  score: number;
  status: "new" | "contacted" | "qualified" | "converted";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadPayload {
  name?: string;
  email: string;
  company?: string;
  phone?: string;
  teamSize?: string;
  message?: string;
  source: string;
  page: string;
  visitorId?: string;
}
