export interface AlternativeFeature {
  feature: string;
  us: boolean;
  them: boolean;
}

export interface Alternative {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  targetKeywords: string[];
  faqs: { q: string; a: string }[];
  features: AlternativeFeature[];
}

const BASE_FEATURES: AlternativeFeature[] = [
  { feature: "Voice Biometric Authentication",  us: true,  them: false },
  { feature: "RBAC Per-Command Access Control", us: true,  them: false },
  { feature: "Immutable Audit Logging",          us: true,  them: false },
  { feature: "Zero Trust Architecture",          us: true,  them: false },
  { feature: "ML Anomaly Detection",             us: true,  them: false },
  { feature: "Sudo Mode — Dual Approval",        us: true,  them: false },
  { feature: "India Data Residency SLA",         us: true,  them: false },
  { feature: "On-Premise Deployment",            us: true,  them: false },
  { feature: "SOC 2 Type II Path",               us: true,  them: false },
  { feature: "DPDP Act 2023 Compliance",         us: true,  them: false },
  { feature: "Natural Language Commands",         us: true,  them: true  },
  { feature: "Enterprise API Access",            us: true,  them: false },
  { feature: "SIEM Integration",                 us: true,  them: false },
  { feature: "Real-Time Threat Alerts",          us: true,  them: false },
  { feature: "Multi-Tenant Isolation",           us: true,  them: false },
];

function baseFaqs(competitor: string): { q: string; a: string }[] {
  return [
    {
      q: `How does AEGIBIT VoiceCore compare to ${competitor} for enterprise security?`,
      a: `AEGIBIT VoiceCore is purpose-built for regulated enterprise environments. Unlike ${competitor}, VoiceCore ships with voice biometric authentication, per-command RBAC, and immutable audit logs as core features — not add-ons.`,
    },
    {
      q: `Does VoiceCore work with the same integrations as ${competitor}?`,
      a: "VoiceCore integrates with 15+ enterprise tools including Slack, Jira, Google Workspace, ServiceNow, Splunk, and PagerDuty. Most teams are connected within 2 hours.",
    },
    {
      q: `Is AEGIBIT VoiceCore cheaper than ${competitor}?`,
      a: "VoiceCore starts at Rs.999/user/month with a free beta tier. Given its security-native architecture, it replaces multiple point solutions, reducing total cost of ownership significantly.",
    },
  ];
}

export const alternatives: Alternative[] = [
  {
    slug: "nova-ai",
    name: "Nova AI Voice Assistant",
    title: "AEGIBIT VoiceCore vs Nova AI — Enterprise Security Comparison",
    metaDescription: "Compare AEGIBIT VoiceCore with Nova AI. See why enterprise security teams choose VoiceCore for Zero Trust voice auth, RBAC, and SOC-grade audit logging.",
    targetKeywords: ["nova ai alternative", "nova voice assistant enterprise", "nova ai vs voicecore"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Nova AI"),
  },
  {
    slug: "alexa-for-business",
    name: "Alexa for Business",
    title: "AEGIBIT VoiceCore vs Alexa for Business — 2026 Comparison",
    metaDescription: "Alexa for Business vs AEGIBIT VoiceCore. Compare voice biometrics, audit logging, RBAC, and India data residency for enterprise security teams.",
    targetKeywords: ["alexa for business alternative", "alexa enterprise security", "alexa vs voicecore"],
    features: [
      ...BASE_FEATURES.slice(0, 10),
      { feature: "Natural Language Commands",  us: true, them: true },
      { feature: "Enterprise API Access",      us: true, them: true },
      { feature: "SIEM Integration",           us: true, them: false },
      { feature: "Real-Time Threat Alerts",    us: true, them: false },
      { feature: "Multi-Tenant Isolation",     us: true, them: false },
    ],
    faqs: baseFaqs("Alexa for Business"),
  },
  {
    slug: "google-assistant-enterprise",
    name: "Google Assistant Enterprise",
    title: "AEGIBIT VoiceCore vs Google Assistant Enterprise — Security Comparison",
    metaDescription: "Google Assistant Enterprise vs AEGIBIT VoiceCore for regulated industries. Compare zero trust, audit trails, and BFSI-grade compliance.",
    targetKeywords: ["google assistant enterprise alternative", "google voice ai security", "google assistant vs voicecore"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Google Assistant Enterprise"),
  },
  {
    slug: "microsoft-cortana",
    name: "Microsoft Cortana",
    title: "AEGIBIT VoiceCore vs Microsoft Cortana — Enterprise Voice AI Comparison",
    metaDescription: "Cortana is deprecated. See how AEGIBIT VoiceCore replaces it with security-native voice AI built for BFSI, healthcare, and enterprise security teams.",
    targetKeywords: ["microsoft cortana alternative", "cortana replacement enterprise", "cortana vs voicecore"],
    features: [
      ...BASE_FEATURES.slice(0, 10),
      { feature: "Natural Language Commands",  us: true, them: true  },
      { feature: "Enterprise API Access",      us: true, them: false },
      { feature: "SIEM Integration",           us: true, them: false },
      { feature: "Active Product Development", us: true, them: false },
      { feature: "Modern LLM Backend",         us: true, them: false },
    ],
    faqs: [
      ...baseFaqs("Microsoft Cortana"),
      { q: "Is Cortana still available for enterprise use?", a: "Microsoft deprecated Cortana for enterprise use in 2023. AEGIBIT VoiceCore is an actively developed, security-native replacement designed for regulated industries." },
    ],
  },
  {
    slug: "siri-shortcuts-business",
    name: "Siri Shortcuts for Business",
    title: "AEGIBIT VoiceCore vs Siri Shortcuts — Enterprise Security Alternative",
    metaDescription: "Siri Shortcuts weren't built for enterprise. See how AEGIBIT VoiceCore provides security-grade voice automation for business-critical workflows.",
    targetKeywords: ["siri shortcuts enterprise alternative", "siri business voice", "siri vs voicecore enterprise"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Siri Shortcuts"),
  },
  {
    slug: "otter-ai",
    name: "Otter.ai",
    title: "AEGIBIT VoiceCore vs Otter.ai — Beyond Transcription to Secure Voice Operations",
    metaDescription: "Otter.ai does transcription. AEGIBIT VoiceCore does secure voice automation with RBAC, biometric auth, and audit trails for enterprise ops teams.",
    targetKeywords: ["otter ai enterprise alternative", "otter ai vs voicecore", "voice ai beyond transcription"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Otter.ai"),
  },
  {
    slug: "fireflies-ai",
    name: "Fireflies.ai",
    title: "AEGIBIT VoiceCore vs Fireflies.ai — Secure Voice Operations Comparison",
    metaDescription: "Compare Fireflies.ai with AEGIBIT VoiceCore. VoiceCore goes beyond note-taking to secure, authenticated voice command execution for enterprise teams.",
    targetKeywords: ["fireflies ai alternative", "fireflies vs voicecore", "fireflies enterprise security"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Fireflies.ai"),
  },
  {
    slug: "krisp-ai",
    name: "Krisp AI",
    title: "AEGIBIT VoiceCore vs Krisp AI — Enterprise Voice Security Comparison",
    metaDescription: "Krisp handles noise cancellation. AEGIBIT VoiceCore handles security — biometric auth, RBAC, audit logs, and zero trust for enterprise voice workflows.",
    targetKeywords: ["krisp ai alternative", "krisp enterprise voice", "krisp vs voicecore security"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Krisp AI"),
  },
  {
    slug: "speechmatics",
    name: "Speechmatics",
    title: "AEGIBIT VoiceCore vs Speechmatics — Enterprise Voice Platform Comparison",
    metaDescription: "Speechmatics provides STT. AEGIBIT VoiceCore provides a complete secure voice operations platform with auth, RBAC, execution, and audit for enterprises.",
    targetKeywords: ["speechmatics alternative", "speechmatics enterprise", "speechmatics vs voicecore"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Speechmatics"),
  },
  {
    slug: "deepgram-enterprise",
    name: "Deepgram Enterprise",
    title: "AEGIBIT VoiceCore vs Deepgram Enterprise — Secure Voice AI Comparison",
    metaDescription: "Deepgram does fast speech-to-text. AEGIBIT VoiceCore delivers the full secure voice operations stack: auth + RBAC + execution + audit for enterprises.",
    targetKeywords: ["deepgram enterprise alternative", "deepgram vs voicecore", "deepgram security compliance"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Deepgram Enterprise"),
  },
  {
    slug: "whisper-ai",
    name: "OpenAI Whisper",
    title: "AEGIBIT VoiceCore vs OpenAI Whisper — Enterprise Security Comparison",
    metaDescription: "Whisper is an open-source transcription model. AEGIBIT VoiceCore is a production-grade secure voice platform with enterprise auth, RBAC, and compliance built in.",
    targetKeywords: ["whisper ai enterprise alternative", "openai whisper vs voicecore", "whisper enterprise security"],
    features: BASE_FEATURES,
    faqs: baseFaqs("OpenAI Whisper"),
  },
  {
    slug: "assembly-ai",
    name: "AssemblyAI",
    title: "AEGIBIT VoiceCore vs AssemblyAI — Enterprise Voice Operations Comparison",
    metaDescription: "AssemblyAI provides speech AI APIs. AEGIBIT VoiceCore delivers the complete secure voice operations platform that enterprises in BFSI and healthcare need.",
    targetKeywords: ["assemblyai enterprise alternative", "assemblyai vs voicecore", "assemblyai security compliance"],
    features: BASE_FEATURES,
    faqs: baseFaqs("AssemblyAI"),
  },
  {
    slug: "rev-ai",
    name: "Rev.ai",
    title: "AEGIBIT VoiceCore vs Rev.ai — Secure Enterprise Voice Platform",
    metaDescription: "Rev.ai transcribes audio. AEGIBIT VoiceCore does the full job — secure voice authentication, command execution with RBAC, and immutable audit trails.",
    targetKeywords: ["rev ai enterprise alternative", "rev.ai vs voicecore", "rev ai security enterprise"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Rev.ai"),
  },
  {
    slug: "nuance-dragon",
    name: "Nuance Dragon",
    title: "AEGIBIT VoiceCore vs Nuance Dragon — Modern Enterprise Voice Security",
    metaDescription: "Nuance Dragon is legacy on-premise dictation. AEGIBIT VoiceCore is the modern security-native voice operations platform built for cloud-first enterprises.",
    targetKeywords: ["nuance dragon alternative", "nuance dragon enterprise replacement", "nuance dragon vs voicecore"],
    features: BASE_FEATURES,
    faqs: [
      ...baseFaqs("Nuance Dragon"),
      { q: "Is Nuance Dragon still the best enterprise voice solution?", a: "Nuance Dragon was built for a pre-cloud world. AEGIBIT VoiceCore brings LLM-powered natural language understanding, voice biometrics, and Zero Trust architecture that Dragon cannot match." },
    ],
  },
  {
    slug: "amazon-transcribe",
    name: "Amazon Transcribe",
    title: "AEGIBIT VoiceCore vs Amazon Transcribe — Enterprise Voice Operations",
    metaDescription: "Amazon Transcribe converts speech to text. AEGIBIT VoiceCore converts speech to secure, authenticated, audited enterprise actions.",
    targetKeywords: ["amazon transcribe alternative", "amazon transcribe enterprise security", "amazon transcribe vs voicecore"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Amazon Transcribe"),
  },
  {
    slug: "ibm-watson-speech",
    name: "IBM Watson Speech to Text",
    title: "AEGIBIT VoiceCore vs IBM Watson Speech — Enterprise Voice Security",
    metaDescription: "IBM Watson Speech handles transcription. AEGIBIT VoiceCore handles the full secure voice operations lifecycle for regulated enterprise environments.",
    targetKeywords: ["ibm watson speech alternative", "watson speech enterprise", "watson vs voicecore"],
    features: BASE_FEATURES,
    faqs: baseFaqs("IBM Watson Speech to Text"),
  },
  {
    slug: "zoom-ai-companion",
    name: "Zoom AI Companion",
    title: "AEGIBIT VoiceCore vs Zoom AI Companion — Enterprise Security Comparison",
    metaDescription: "Zoom AI Companion is a meeting assistant. AEGIBIT VoiceCore is a secure voice command platform for enterprise ops, security, and compliance teams.",
    targetKeywords: ["zoom ai companion alternative", "zoom ai enterprise security", "zoom ai vs voicecore"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Zoom AI Companion"),
  },
  {
    slug: "notion-ai",
    name: "Notion AI Voice",
    title: "AEGIBIT VoiceCore vs Notion AI Voice — Secure Enterprise Operations",
    metaDescription: "Notion AI is a productivity tool. AEGIBIT VoiceCore is a security-first voice platform for enterprise teams that need auth, RBAC, and compliance.",
    targetKeywords: ["notion ai voice alternative", "notion enterprise security voice", "notion ai vs voicecore"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Notion AI"),
  },
  {
    slug: "microsoft-copilot",
    name: "Microsoft Copilot",
    title: "AEGIBIT VoiceCore vs Microsoft Copilot — Enterprise Voice Security",
    metaDescription: "Microsoft Copilot boosts productivity. AEGIBIT VoiceCore adds the security layer enterprises need: voice biometrics, RBAC, and tamper-proof audit trails.",
    targetKeywords: ["microsoft copilot voice alternative", "copilot enterprise security", "copilot vs voicecore"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Microsoft Copilot"),
  },
  {
    slug: "salesforce-einstein-voice",
    name: "Salesforce Einstein Voice",
    title: "AEGIBIT VoiceCore vs Salesforce Einstein Voice — Security Comparison",
    metaDescription: "Einstein Voice is CRM-focused. AEGIBIT VoiceCore secures your entire enterprise voice layer with Zero Trust, biometric auth, and cross-platform RBAC.",
    targetKeywords: ["salesforce einstein voice alternative", "einstein voice enterprise security", "salesforce voice vs voicecore"],
    features: BASE_FEATURES,
    faqs: baseFaqs("Salesforce Einstein Voice"),
  },
];
