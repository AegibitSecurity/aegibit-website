export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  industry: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote: "We evaluated six voice AI platforms. AEGIBIT was the only one that didn't ask us to choose between productivity and security. The biometric layer and immutable audit logs were exactly what our CISO demanded.",
    author: "Arjun Mehta",
    title: "Head of Information Security",
    company: "Leading NBFC",
    industry: "BFSI",
    initials: "AM",
  },
  {
    id: "t2",
    quote: "Onboarding took two hours. Our SOC team was running voice-authenticated incident commands by end of day. The anomaly detection has already flagged two suspicious access patterns we'd have missed.",
    author: "Priya Sharma",
    title: "CISO",
    company: "Regional Bank",
    industry: "BFSI",
    initials: "PS",
  },
  {
    id: "t3",
    quote: "As a CTO at a health-tech company, data residency isn't optional — it's regulatory. AEGIBIT gave us India-only data guarantees and SOC 2 documentation on day one. No other vendor could do that.",
    author: "Rahul Nair",
    title: "CTO",
    company: "HealthTech Startup",
    industry: "Healthcare",
    initials: "RN",
  },
];
