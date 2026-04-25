export interface VisitorSession {
  id: string;
  sessionId: string;
  ip?: string;
  userAgent?: string;
  device?: "desktop" | "mobile" | "tablet";
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  referrer?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  landingPage: string;
  currentPage: string;
  pagesViewed: string[];
  scrollDepth: number;
  timeOnSite: number;
  clickCount: number;
  formInteractions: number;
  exitIntentTriggered: boolean;
  behaviorScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BehaviorTier = "cold" | "warm" | "hot" | "ready";
