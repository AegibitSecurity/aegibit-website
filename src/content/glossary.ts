export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  related: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  { slug: "zero-trust", term: "Zero Trust", definition: "A security model requiring strict identity verification for every person and device regardless of network location. Operates on 'never trust, always verify.'", related: ["RBAC", "Voice Biometrics", "Audit Logs"] },
  { slug: "voice-biometrics", term: "Voice Biometrics", definition: "Use of unique vocal characteristics to verify identity. Provides continuous authentication across an entire spoken interaction.", related: ["Zero Trust", "MFA", "Speaker Verification"] },
  { slug: "rbac", term: "Role-Based Access Control (RBAC)", definition: "Method of regulating access based on user roles. Permissions assigned to roles, users assigned to roles based on responsibilities.", related: ["Zero Trust", "Least Privilege", "ACL"] },
  { slug: "audit-log", term: "Audit Log", definition: "Chronological record of system activities providing documentary evidence. Immutable audit logs cannot be altered or deleted.", related: ["Compliance", "SIEM", "SOC 2"] },
  { slug: "anomaly-detection", term: "Anomaly Detection", definition: "Identification of patterns that deviate from expected behavior using ML to flag unusual access patterns or command sequences.", related: ["SIEM", "Behavioral AI", "Insider Threat"] },
  { slug: "soc2", term: "SOC 2", definition: "Service Organization Control 2 — a security compliance framework for service providers storing customer data in the cloud, covering Security, Availability, Integrity, Confidentiality, and Privacy.", related: ["Audit Logs", "Compliance", "ISO 27001"] },
  { slug: "dpdp", term: "DPDP Act 2023", definition: "India's Digital Personal Data Protection Act 2023 — the country's first comprehensive data protection law governing collection, processing, and storage of personal data.", related: ["Data Residency", "Compliance", "Privacy"] },
  { slug: "sudo-mode", term: "Sudo Mode", definition: "A dual-approval workflow requiring a second authenticated voice approval from a designated authority before executing high-risk commands.", related: ["RBAC", "Zero Trust", "4-Eyes Principle"] },
];
