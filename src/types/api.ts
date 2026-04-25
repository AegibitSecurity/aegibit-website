export interface ApiSuccess<T = unknown> {
  ok: true;
  data?: T;
}

export interface ApiError {
  ok: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface AnalyticsResponse {
  totalVisitors: number;
  activeNow: number;
  totalLeads: number;
  conversionRate: string;
  visitors: unknown[];
  leads: unknown[];
}

export interface RoiResponse {
  weeklyWasteCost: number;
  annualWasteCost: number;
  annualAegibitCost: number;
  annualSavings: number;
  roiPercent: number;
  paybackMonths: number | null;
}
