import type { ChatMessage } from "./aira-bot";

// The lead API accepts 2,000 characters. Keep recent buyer context first.
export function buildChatLeadMessage(messages: ChatMessage[], country: string, timeline: string): string {
  const questions = messages.filter(m => m.role === "user").slice(-6).map(m => m.text.trim()).filter(Boolean).join("\n");
  const context = `Country / time zone: ${country.trim().slice(0, 100) || "Not provided"}\nTarget date: ${timeline.trim().slice(0, 100) || "Not provided"}`;
  return `${context}\n\nVISITOR REQUIREMENTS\n${questions}`.slice(0, 1900);
}
