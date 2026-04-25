import { create } from "zustand";

interface DashboardState {
  timeframe: "today" | "7d" | "30d";
  totalVisitors: number;
  activeNow: number;
  totalLeads: number;
  conversionRate: string;
  loading: boolean;
  lastUpdated: Date | null;

  setTimeframe: (t: "today" | "7d" | "30d") => void;
  setStats: (s: Partial<DashboardState>) => void;
  setLoading: (v: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  timeframe:      "today",
  totalVisitors:  0,
  activeNow:      0,
  totalLeads:     0,
  conversionRate: "0.0",
  loading:        true,
  lastUpdated:    null,

  setTimeframe: (t) => set({ timeframe: t }),
  setStats:     (s) => set({ ...s, lastUpdated: new Date() }),
  setLoading:   (v) => set({ loading: v }),
}));
