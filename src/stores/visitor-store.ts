import { create } from "zustand";
import { calculateBehaviorScore, getBehaviorTier } from "@/lib/behavior-engine";
import type { BehaviorTier } from "@/types/visitor";

interface VisitorState {
  sessionId: string;
  visitorId: string | null;
  pagesViewed: string[];
  scrollDepthMax: number;
  currentPage: string;
  timeOnSiteSeconds: number;
  clickCount: number;
  formInteractions: number;
  exitIntentTriggered: boolean;
  behaviorScore: number;
  behaviorTier: BehaviorTier;
  clickedCTA: boolean;
  startedForm: boolean;
  submittedForm: boolean;
  visitedPricingPage: boolean;
  visitedAlternativesPage: boolean;

  setVisitorId: (id: string) => void;
  addPage: (page: string) => void;
  updateScrollDepth: (depth: number) => void;
  incrementTime: () => void;
  incrementClicks: () => void;
  incrementFormInteractions: () => void;
  setExitIntentTriggered: () => void;
  setClickedCTA: () => void;
  setStartedForm: () => void;
  setSubmittedForm: () => void;
  recalculateScore: () => void;
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const useVisitorStore = create<VisitorState>((set, get) => ({
  sessionId: generateUUID(),
  visitorId: null,
  pagesViewed: [],
  scrollDepthMax: 0,
  currentPage: "/",
  timeOnSiteSeconds: 0,
  clickCount: 0,
  formInteractions: 0,
  exitIntentTriggered: false,
  behaviorScore: 0,
  behaviorTier: "cold",
  clickedCTA: false,
  startedForm: false,
  submittedForm: false,
  visitedPricingPage: false,
  visitedAlternativesPage: false,

  setVisitorId: (id) => set({ visitorId: id }),

  addPage: (page) => set((s) => ({
    pagesViewed: s.pagesViewed.includes(page) ? s.pagesViewed : [...s.pagesViewed, page],
    currentPage: page,
    visitedPricingPage:      s.visitedPricingPage      || page.includes("pricing"),
    visitedAlternativesPage: s.visitedAlternativesPage || page.includes("alternatives"),
  })),

  updateScrollDepth: (depth) => set((s) => ({
    scrollDepthMax: Math.max(s.scrollDepthMax, depth),
  })),

  incrementTime:           () => set((s) => ({ timeOnSiteSeconds: s.timeOnSiteSeconds + 30 })),
  incrementClicks:         () => set((s) => ({ clickCount: s.clickCount + 1 })),
  incrementFormInteractions: () => set((s) => ({ formInteractions: s.formInteractions + 1 })),
  setExitIntentTriggered:  () => set({ exitIntentTriggered: true }),
  setClickedCTA:           () => set({ clickedCTA: true }),
  setStartedForm:          () => set({ startedForm: true }),
  setSubmittedForm:        () => set({ submittedForm: true }),

  recalculateScore: () => {
    const s = get();
    const score = calculateBehaviorScore({
      pagesViewed:             s.pagesViewed.length,
      scrollDepthMax:          s.scrollDepthMax,
      onPricingPage:           s.currentPage.includes("pricing"),
      visitedPricingPage:      s.visitedPricingPage,
      visitedAlternativesPage: s.visitedAlternativesPage,
      clickedCTA:              s.clickedCTA,
      startedForm:             s.startedForm,
      submittedForm:           s.submittedForm,
      timeOnSiteSeconds:       s.timeOnSiteSeconds,
      isReturnVisitor:         typeof document !== "undefined" && document.cookie.includes("vc_return=1"),
      bouncedEarly:            s.timeOnSiteSeconds < 10 && s.pagesViewed.length <= 1,
    });
    set({ behaviorScore: score, behaviorTier: getBehaviorTier(score) });
  },
}));
