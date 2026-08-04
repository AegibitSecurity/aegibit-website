/**
 * The AEGIBIT Glossary content library, Sprint 1 of the execution
 * roadmap (exp-glossary-geo, the first approved Business Experiment).
 *
 * THE BAR (set by Rahul, 2026-08-04): every page must be one of the
 * best freely available resources on its topic. Not AI filler. Each
 * term answers: what is it, why it matters, how it works, a real
 * example, common mistakes, best practices, related concepts, FAQs.
 *
 * Honesty rules: AEGIBIT tie-ins only state what our products
 * actually do. No invented statistics. Related terms cross-link so
 * the set forms a genuine topic cluster (internal-link equity).
 *
 * Used by: /glossary (index), /glossary/[slug] (pages), sitemap.ts.
 * The Aira KB crawler ingests the published pages automatically, so
 * every term added here also makes the chat consultant and /llms.txt
 * smarter (the flywheel principle).
 *
 * (This file replaces the retired VoiceCore-era stub list that
 * previously lived here unused.)
 */

export interface GlossaryFaq {
  q: string;
  a: string;
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  /** One-breath definition, also the meta description seed. */
  short: string;
  why: string;
  how: string;
  example: string;
  mistakes: string[];
  bestPractices: string[];
  related: string[]; // slugs
  faqs: GlossaryFaq[];
  /** Honest product tie-in, only what we actually ship. */
  aegibit?: { text: string; href: string; label: string };
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "zero-trust",
    term: "Zero Trust",
    short:
      "A security model that treats every request as untrusted until verified, regardless of whether it originates inside or outside the network. The operating principle: never trust, always verify.",
    why:
      "Perimeter security assumed everything inside the office network was safe. Cloud apps, remote work, and phone-based workflows dissolved that perimeter, and a single stolen password now walks straight past a castle-and-moat defence. Zero Trust matters because it limits how far an attacker can travel after any single control fails.",
    how:
      "Every access request is evaluated on identity, device, context, and least privilege before it is granted, and the evaluation repeats continuously rather than once at login. In practice that combines strong authentication, per-role permissions, network segmentation, and audit logging, so each resource makes its own trust decision instead of inheriting one from the network.",
    example:
      "A multi-branch business runs its expense system in the cloud. Under Zero Trust, a branch accountant signs in with their own identity, sees only their branch's vouchers, and every approval they make is logged with who, where, and when. If their password leaks, the attacker still cannot see other branches, approve beyond the accountant's tier, or erase the trail.",
    mistakes: [
      "Buying a 'Zero Trust product' and declaring the job done; it is an architecture and a discipline, not a single tool",
      "Verifying identity once at login and then trusting the session forever",
      "Granting broad roles because fine-grained permissions feel slow to set up",
      "Leaving service accounts and integrations outside the model while locking down only human users",
    ],
    bestPractices: [
      "Start from least privilege: every role gets the minimum access its job needs",
      "Make audit logging non-optional and immutable, verification without evidence is theatre",
      "Apply the model to machines and API keys, not just people",
      "Roll out incrementally: protect the highest-value system first, then expand",
    ],
    related: ["rbac", "audit-log", "row-level-security", "otp-authentication"],
    faqs: [
      {
        q: "Is Zero Trust only for large enterprises?",
        a: "No. Small multi-branch businesses arguably benefit more, because one shared password or over-broad role can expose the whole operation. The principles scale down cleanly: least privilege, per-user identity, and logged actions.",
      },
      {
        q: "Does Zero Trust slow teams down?",
        a: "Implemented well, users mostly notice nothing: they sign in and see exactly what their role needs. The friction of occasional re-verification is far cheaper than the downtime of an account-takeover incident.",
      },
      {
        q: "Where should a business start?",
        a: "With the system that moves money or holds customer data. Give every user their own identity, scope roles tightly, turn on audit logs, and expand outward from there.",
      },
    ],
    aegibit: {
      text: "AEGIBIT builds every product on Zero Trust foundations: per-user identity, role-scoped access, and immutable audit logs are defaults, not add-ons.",
      href: "/security",
      label: "How AEGIBIT engineers security",
    },
  },
  {
    slug: "rbac",
    term: "Role-Based Access Control (RBAC)",
    short:
      "An access-control method where permissions attach to roles (accountant, manager, owner) rather than to individuals, and people inherit permissions by being assigned a role.",
    why:
      "Managing permissions person-by-person collapses as a team grows: access accumulates, nobody remembers why, and offboarding leaves ghosts with live credentials. RBAC matters because it makes access reviewable: you audit a handful of roles instead of every individual, and revoking a person is one clean operation.",
    how:
      "You define roles that mirror real responsibilities, attach specific permissions to each role (view vouchers, approve up to a limit, export reports), then assign users to roles. Systems enforce the mapping at every request. Good implementations also support tiered approvals, so a role can act only within its limit and must escalate beyond it.",
    example:
      "In a dealership expense system, a branch cashier can create vouchers, the branch manager can approve up to a set amount, the group finance head approves above it, and only the owner can delete anything. When a cashier changes branches, one role reassignment updates every permission at once.",
    mistakes: [
      "Creating one 'admin' role that half the company ends up holding",
      "Cloning roles per person, which recreates individual permissions with extra steps",
      "Never reviewing role membership, so leavers and role-changers keep old access",
      "Forgetting deletion rights: if everyone can delete records, the audit trail is decorative",
    ],
    bestPractices: [
      "Mirror the org chart honestly: roles should match how responsibility actually flows",
      "Reserve destructive permissions (delete, export-all, config) for the narrowest role",
      "Review role assignments quarterly and on every exit",
      "Pair RBAC with audit logging so every permitted action is still attributable",
    ],
    related: ["zero-trust", "audit-log", "multi-tenant-architecture"],
    faqs: [
      {
        q: "How many roles should a small business define?",
        a: "As few as honestly reflect the work, typically three to six: operator, approver, finance, owner. More roles than realities creates confusion; fewer creates over-broad access.",
      },
      {
        q: "What is the difference between RBAC and simple user accounts?",
        a: "Accounts identify who is acting; RBAC governs what they may do. Identity without scoped permissions still lets any user do everything, which is how most internal fraud stays invisible.",
      },
      {
        q: "Can RBAC prevent fraud?",
        a: "It removes the easiest paths: no single role can create, approve, and erase a transaction alone. Combined with immutable logs, it turns fraud from an edit into a visible anomaly.",
      },
    ],
    aegibit: {
      text: "PayMint ships with dealership-shaped roles and tiered approval limits; Cortex adds custom roles and dynamic permissions from day one.",
      href: "/products/paymint",
      label: "See RBAC in PayMint",
    },
  },
  {
    slug: "audit-log",
    term: "Audit Log (Audit Trail)",
    short:
      "A chronological, tamper-resistant record of who did what, when, and from where in a system. Immutable audit logs cannot be edited or deleted, which is what makes them evidence rather than notes.",
    why:
      "When money or data moves, disputes eventually follow: a missing voucher, a changed price, a deleted customer. Without an audit trail the answer is someone's memory against someone else's. With one, the system itself testifies. Audit logs also deter quietly: people behave differently when actions are attributable.",
    how:
      "Every meaningful action (create, approve, edit, delete, login) is written as an event with actor, timestamp, and context. Immutability is enforced by design: application roles get insert-only access, deletions are soft and logged, and sensitive events may be hash-chained so any tampering breaks the chain visibly.",
    example:
      "A boutique notices a bill for a large sale has vanished. In a system with an owner-only delete policy and a permanent log, the record shows which account deleted it and when, turning a mystery into a five-minute conversation. In a spreadsheet, that sale simply never existed.",
    mistakes: [
      "Logging only logins while the actions that matter (approvals, edits, deletions) go unrecorded",
      "Letting administrators edit or purge the log, which converts evidence back into opinion",
      "Keeping logs nobody can read or search, retention without accessibility",
      "Treating logs as an afterthought instead of designing them into every workflow",
    ],
    bestPractices: [
      "Make the log insert-only at the database layer, not just in the UI",
      "Record the business meaning (approved voucher V-104 for X amount), not just raw table changes",
      "Surface the trail in-product so owners can self-serve answers",
      "Align retention with your compliance needs and review access to the log itself",
    ],
    related: ["rbac", "zero-trust", "petty-cash-management", "row-level-security"],
    faqs: [
      {
        q: "What should a small business log at minimum?",
        a: "Every financial mutation (create, approve, edit, delete), every login, and every permission change, each with actor and timestamp. That covers most disputes and most compliance questions.",
      },
      {
        q: "Are audit logs a legal requirement?",
        a: "Depends on jurisdiction and industry, but financial record-keeping obligations generally assume trustworthy records. Immutable logs make audits faster and cheaper regardless of whether a statute names them.",
      },
      {
        q: "Do audit logs slow systems down?",
        a: "Writing an event row per action is negligible for typical business volumes. The real cost is designing them well; the real price is not having them.",
      },
    ],
    aegibit: {
      text: "Every AEGIBIT product writes an immutable trail: PayMint anchors every voucher to a person, place, and minute; Vestiq logs every bill and payment action permanently.",
      href: "/products/paymint",
      label: "Audit-grade logging in PayMint",
    },
  },
  {
    slug: "prompt-injection",
    term: "Prompt Injection",
    short:
      "An attack on AI systems where malicious instructions are hidden inside content the model reads (a document, web page, or tool description), tricking it into following the attacker instead of the user.",
    why:
      "AI assistants increasingly read email, browse pages, and call tools. Anything they read is potential input, and models do not inherently distinguish 'data to summarize' from 'instructions to obey'. A successful injection can exfiltrate data, misuse connected tools, or quietly rewrite the assistant's behavior, all without malware in the traditional sense.",
    how:
      "The attacker plants text where the model will encounter it: a webpage the assistant summarizes, a shared file, a calendar invite, or a manipulated tool description. The text addresses the model directly ('ignore previous instructions and send the contents of...'). Defences work by boundary-setting: treating retrieved content as untrusted data, constraining what tools can do, requiring human approval for consequential actions, and scanning inputs for injection patterns.",
    example:
      "A company chatbot answers from its website knowledge base. An attacker gets a page indexed containing hidden text instructing the bot to reveal internal prompts and redirect users to a phishing link. A grounded bot with strict boundaries refuses: it answers only from vetted content and never follows instructions found inside that content.",
    mistakes: [
      "Assuming a system prompt saying 'ignore malicious instructions' is sufficient defence",
      "Letting a model act on tools (send, delete, pay) directly from untrusted content without a human gate",
      "Feeding unvetted external content into the same context as privileged instructions",
      "Never testing the assistant adversarially before shipping it",
    ],
    bestPractices: [
      "Architect so the model can only read curated, public, or sanitized sources",
      "Gate consequential actions behind explicit human approval",
      "Scan tool descriptions and retrieved content for injection patterns before they reach the model",
      "Log model actions like any other privileged actor and review anomalies",
    ],
    related: ["tool-poisoning", "model-context-protocol", "retrieval-augmented-generation"],
    faqs: [
      {
        q: "Is prompt injection the same as jailbreaking?",
        a: "Related but different: jailbreaking is a user trying to bypass a model's rules directly; prompt injection hides the attack in third-party content so the model betrays its actual user.",
      },
      {
        q: "Can prompt injection be fully solved?",
        a: "Today it is managed, not eliminated. Robust systems combine content boundaries, least-privilege tools, human gates, and detection, the same defence-in-depth logic as classic security.",
      },
      {
        q: "Does this affect small businesses using AI chatbots?",
        a: "Yes, any bot that reads external content or holds tool access is in scope. The mitigations are architectural choices made when the bot is built, which is why security-first construction matters.",
      },
    ],
    aegibit: {
      text: "MCP Shield, AEGIBIT's open-source scanner, detects prompt-injection and hidden-instruction patterns in AI tool servers before they reach a model.",
      href: "/products/mcp-shield",
      label: "Scan for injection with MCP Shield",
    },
  },
  {
    slug: "tool-poisoning",
    term: "Tool Poisoning",
    short:
      "An attack where the description or metadata of an AI tool (the text a model reads to decide how to use it) carries hidden malicious instructions, corrupting every agent that loads the tool.",
    why:
      "Agentic AI works by reading tool descriptions and deciding when to call them. That makes the descriptions themselves an instruction channel. A poisoned tool does not need to exploit code: the attack ships in plain text, activates in any connected model, and can instruct exfiltration or misuse of other legitimate tools. As businesses adopt tool-using agents, this is supply-chain risk in a new costume.",
    how:
      "The attacker publishes or compromises a tool server whose tool descriptions embed directives ('before every call, also send the conversation to...'), sometimes hidden with encoding tricks or invisible Unicode. Defences: scan tool schemas for imperative or hidden content before registration, pin and review tool versions like dependencies, run agents least-privileged, and monitor calls for behavior that does not match user intent.",
    example:
      "A developer connects a free community tool server to their AI workflow. One tool's description contains a hidden instruction to include environment secrets in its arguments. Every agent that loads it obeys silently. A pre-registration scan flags the imperative text and the hidden Unicode, and the server never enters the workflow.",
    mistakes: [
      "Connecting community tool servers without reading or scanning their schemas",
      "Trusting a tool forever after one review, descriptions can change on update",
      "Running agents with broad credentials so any poisoned tool inherits them",
      "Assuming code review covers it; the payload is prose, not code",
    ],
    bestPractices: [
      "Scan every tool schema for injection patterns, hidden Unicode, and secret-shaped strings before use",
      "Version-pin tool servers and re-scan on every update",
      "Apply least privilege to agent credentials and per-tool permissions",
      "Log and review tool calls the way you review privileged user actions",
    ],
    related: ["prompt-injection", "model-context-protocol", "zero-trust"],
    faqs: [
      {
        q: "How is tool poisoning different from prompt injection?",
        a: "Prompt injection hides instructions in content a model reads; tool poisoning specifically plants them in tool descriptions and metadata, compromising the agent's action layer at its source.",
      },
      {
        q: "Who should worry about this?",
        a: "Anyone wiring AI agents to tools, from solo developers using open-source tool servers to enterprises building internal agents. The ecosystem is young and review practices are still maturing.",
      },
      {
        q: "What is the quickest practical defence?",
        a: "Automated scanning of tool schemas before registration plus least-privilege credentials. Together they neutralize most known poisoning patterns cheaply.",
      },
    ],
    aegibit: {
      text: "Tool poisoning is exactly what MCP Shield was built to catch: it scans Model Context Protocol servers for poisoned descriptions, hidden Unicode, and secret exposure. Free and open source.",
      href: "/products/mcp-shield",
      label: "Explore MCP Shield",
    },
  },
  {
    slug: "model-context-protocol",
    term: "Model Context Protocol (MCP)",
    short:
      "An open protocol that standardizes how AI models connect to external tools, data sources, and services, letting any compliant model use any compliant tool server.",
    why:
      "Before standardization, every AI-to-tool integration was custom glue. MCP matters because it turns tools into an ecosystem: businesses can expose their systems to AI assistants once and work with many models. It equally matters for security: a standard connection layer concentrates risk, so vetting MCP servers becomes as important as vetting software dependencies.",
    how:
      "An MCP server declares tools (functions with names, descriptions, and schemas), resources, and prompts. A client (the AI application) connects, lists what is available, and the model decides when to invoke tools during a conversation. Transport is typically local stdio or HTTP. Because the model reads tool descriptions as text, those descriptions are part of the attack surface, and launch configurations and credentials need the same care as any service deployment.",
    example:
      "A business connects its AI assistant to an MCP server exposing 'search customer records' and 'create support ticket'. The assistant can now resolve a complaint end to end. If that server came from an unvetted source, however, a poisoned description could redirect the same capabilities, which is why registration-time scanning exists.",
    mistakes: [
      "Treating MCP servers as harmless plugins instead of privileged software dependencies",
      "Running servers with credentials far broader than the tools require",
      "Skipping review of tool descriptions, the part the model actually obeys",
      "Exposing sensitive internal systems without human gates on consequential actions",
    ],
    bestPractices: [
      "Scan servers for tool poisoning and injection patterns before connecting them",
      "Pin versions; re-scan on updates like any dependency bump",
      "Scope credentials per server to the minimum its tools genuinely need",
      "Prefer reputable, auditable servers and read the schema of anything else",
    ],
    related: ["tool-poisoning", "prompt-injection", "retrieval-augmented-generation"],
    faqs: [
      {
        q: "Is MCP tied to one AI vendor?",
        a: "It is an open protocol with multi-vendor adoption; that neutrality is why an ecosystem of servers exists, and why supply-chain hygiene around them matters.",
      },
      {
        q: "Should a business build its own MCP server?",
        a: "If AI assistants should act on your systems, yes, a scoped server you control beats granting a third-party tool broad API keys. Build it least-privileged with logging from day one.",
      },
      {
        q: "What are the main security risks with MCP?",
        a: "Poisoned tool descriptions, prompt injection through returned content, secret exposure in configurations, and unsafe launch patterns. All are scannable and manageable with discipline.",
      },
    ],
    aegibit: {
      text: "AEGIBIT built MCP Shield after studying real MCP attack disclosures: an open-source scanner and runtime firewall for exactly this layer.",
      href: "/products/mcp-shield",
      label: "MCP Shield by AEGIBIT",
    },
  },
  {
    slug: "row-level-security",
    term: "Row-Level Security (RLS)",
    short:
      "A database feature that enforces, at the database itself, which rows each user or tenant can see or change, so isolation holds even if application code has bugs.",
    why:
      "Most data leaks between customers in shared systems come from one missed WHERE clause. RLS matters because it moves tenant isolation from 'every developer remembers, every time' to 'the database refuses, always'. For any SaaS or multi-branch system holding other people's data, it converts a class of catastrophic bugs into non-events.",
    how:
      "Policies are declared on tables: for example, a row is visible only when its tenant_id matches the requesting session's tenant. The database evaluates the policy on every query, application mistakes cannot bypass it because the enforcement happens below the application. Forced RLS extends this so even the table owner's connections obey policies.",
    example:
      "A boutique-management platform serves hundreds of shops from one database. Each row carries the shop's id and RLS policies bind every query to the signed-in shop. A developer later ships a buggy report query with no shop filter; instead of leaking every shop's sales, the database returns only the caller's rows. The bug becomes a wrong report, not a breach.",
    mistakes: [
      "Enforcing isolation only in application code and hoping every query remembers",
      "Enabling RLS but leaving service-role connections that bypass it in normal request paths",
      "Writing policies against client-supplied values instead of authenticated session context",
      "Never testing cross-tenant access as part of CI",
    ],
    bestPractices: [
      "Put a tenant id on every multi-tenant table and FORCE row-level security on",
      "Derive policy inputs from verified session claims, never from request parameters",
      "Keep privileged bypass connections out of user-facing paths and audit their use",
      "Add automated tests that attempt cross-tenant reads and expect failure",
    ],
    related: ["multi-tenant-architecture", "zero-trust", "audit-log"],
    faqs: [
      {
        q: "Does RLS replace application authorization?",
        a: "No, it backstops it. RBAC decides what actions a role may take; RLS guarantees which rows those actions can ever touch. Together they give defence in depth.",
      },
      {
        q: "Is RLS slow?",
        a: "Policies add a predicate to queries; with proper indexes on tenant columns the overhead is typically negligible compared to the risk it removes.",
      },
      {
        q: "Which databases support it?",
        a: "PostgreSQL has mature support (widely used via platforms like Supabase); SQL Server and others offer equivalents. The concept transfers even where syntax differs.",
      },
    ],
    aegibit: {
      text: "AEGIBIT Cortex enforces tenant isolation with PostgreSQL RLS on every multi-tenant table, a tenant id on every row, checked by the database on every query.",
      href: "/products/cortex",
      label: "How Cortex isolates tenants",
    },
  },
  {
    slug: "retrieval-augmented-generation",
    term: "Retrieval-Augmented Generation (RAG)",
    short:
      "An AI architecture where a model retrieves relevant documents from a trusted knowledge base at question time and answers from them, instead of relying on whatever it memorized in training.",
    why:
      "Plain language models guess plausibly, which is fatal for business use: stale product facts, invented prices, confident nonsense. RAG matters because it grounds answers in your actual, current content, makes them citable, and lets knowledge update by updating documents rather than retraining or rewriting prompts.",
    how:
      "Content is split into chunks and indexed (lexically, as vectors, or both). At question time the system retrieves the most relevant chunks, injects them into the model's context with instructions to answer only from them, and ideally returns the sources used. Quality hinges on retrieval: good chunking, fresh indexing, and honest fallbacks when nothing relevant exists.",
    example:
      "A company chatbot once pitched a retired product for weeks because its knowledge lived in a hardcoded prompt nobody updated. Rebuilt as RAG over the live website, the bot now learns every new page automatically at the next crawl and cites the page it answered from. Ship content, and the bot is current, no prompt edits.",
    mistakes: [
      "Indexing everything, including private documents, into a bot exposed to the public",
      "Letting the model answer from general knowledge when retrieval finds nothing, hello hallucinations",
      "Never refreshing the index, recreating the stale-prompt problem with extra steps",
      "Skipping source citation, which removes the user's ability to verify",
    ],
    bestPractices: [
      "Index only content the audience is entitled to see; public bot, public content",
      "Instruct the model to say 'I do not have that' when retrieval is empty, and escalate to a human",
      "Automate index refresh from the source of truth",
      "Show sources with answers; verifiability builds trust and catches errors",
    ],
    related: ["prompt-injection", "model-context-protocol", "multi-tenant-architecture"],
    faqs: [
      {
        q: "Does RAG eliminate hallucinations?",
        a: "It reduces them sharply when paired with strict grounding rules and honest empty-retrieval behavior. Discipline in the prompt and architecture matters as much as retrieval itself.",
      },
      {
        q: "Do I need a vector database?",
        a: "Not always. Small, well-structured corpora often do excellently with lexical retrieval plus query expansion; vectors earn their complexity as scale and ambiguity grow.",
      },
      {
        q: "Is RAG secure by default?",
        a: "No. Retrieved content is untrusted input (see prompt injection), and the index defines what can leak. Security comes from what you index and how the model is constrained.",
      },
    ],
    aegibit: {
      text: "Aira, the consultant on this site, is RAG over aegibit.com itself: it auto-learns every published page weekly and cites sources under its answers.",
      href: "/",
      label: "Ask Aira anything about AEGIBIT",
    },
  },
  {
    slug: "dpdp-act",
    term: "DPDP Act (Digital Personal Data Protection Act, India)",
    short:
      "India's data-protection law (2023) governing how organizations collect, process, store, and share the personal data of individuals in India, with consent, purpose limitation, and security obligations.",
    why:
      "Any business holding customer phone numbers, addresses, or payment references is processing personal data. The DPDP Act matters because it converts good data hygiene from courtesy into legal obligation, with real penalties, and because customers increasingly choose vendors who can answer 'how do you protect my data' convincingly.",
    how:
      "The Act centres on consent-based processing for defined purposes, obligations on 'data fiduciaries' (the entities deciding why and how data is processed) to secure data and honor rights such as correction and erasure, breach notification duties, and restrictions on retaining data beyond its purpose. Compliance in practice means knowing what personal data you hold, why, where, who can touch it, and being able to delete it on request.",
    example:
      "A retail software vendor stores customer names and phone numbers for billing on behalf of shops. Under the DPDP lens, the vendor maps this data, restricts staff access by role, logs every access, keeps it hosted appropriately, and builds deletion workflows, so when a shop's customer invokes rights, the chain can actually comply.",
    mistakes: [
      "Collecting data 'because it might be useful', purpose limitation forbids exactly this",
      "Keeping personal data in exports, chats, and spreadsheets outside governed systems",
      "Having no deletion path, rights you cannot execute are violations waiting",
      "Treating compliance as a legal document instead of an engineering property",
    ],
    bestPractices: [
      "Inventory personal data: what, where, why, who accesses it",
      "Minimize collection and retention to the stated purpose",
      "Enforce access by role, log access, and secure data in transit and at rest",
      "Design erasure and correction as product features, not manual heroics",
    ],
    related: ["audit-log", "row-level-security", "zero-trust"],
    faqs: [
      {
        q: "Does the DPDP Act apply to small businesses?",
        a: "It applies to processing of digital personal data broadly, with certain obligations scaled by role and scale. Building on purpose limitation, security, and deletability is the safe posture at any size.",
      },
      {
        q: "What is a data fiduciary versus a processor?",
        a: "The fiduciary decides the purpose and means of processing; a processor acts on the fiduciary's instructions. Software vendors are often processors for their clients' customer data, contracts should reflect that.",
      },
      {
        q: "Where should compliance start for a software product?",
        a: "In architecture: role-scoped access, audit logs, encryption, data mapped to purpose, and deletion workflows. Paper policies follow engineering reality, not the reverse.",
      },
    ],
    aegibit: {
      text: "AEGIBIT builds DPDP-aware systems by default: data minimization, role-scoped access, immutable logs, and India-region hosting where it matters.",
      href: "/dpdp",
      label: "AEGIBIT's DPDP posture",
    },
  },
  {
    slug: "multi-tenant-architecture",
    term: "Multi-Tenant Architecture",
    short:
      "A software design where one application instance securely serves many customers (tenants), with each tenant's data isolated as strictly as if they had their own system.",
    why:
      "Single-tenant deployments multiply cost and maintenance by customer count. Multi-tenancy matters because it makes modern SaaS economics possible, one codebase, one upgrade, many customers, but it concentrates the isolation problem: the architecture, not luck, must guarantee tenant A can never see tenant B.",
    how:
      "Common patterns range from shared database with a tenant id on every row (enforced by row-level security), through schema-per-tenant, to database-per-tenant for extreme isolation. Requests carry verified tenant context from authentication; every query, cache, file path, and background job scopes to it. Billing, quotas, and configuration also key off the tenant.",
    example:
      "A CRM serves hundreds of companies from one PostgreSQL cluster. Every table carries tenant_id, RLS policies enforce matching, and staff tooling uses separate audited paths. When one customer requests an export or deletion, it is a scoped operation, not an archaeology project.",
    mistakes: [
      "Relying on application filters alone for isolation (one missed clause = cross-tenant leak)",
      "Leaking tenants through side channels: caches, logs, search indexes, file storage",
      "Sequential ids that let tenants infer each other's existence and scale",
      "No per-tenant export/delete capability, painful for both sales and compliance",
    ],
    bestPractices: [
      "Enforce isolation at the database with RLS in shared-schema designs",
      "Propagate tenant context from verified auth claims through every layer, including jobs",
      "Test cross-tenant access automatically in CI",
      "Design tenant export and deletion early; they unlock enterprise deals and legal compliance",
    ],
    related: ["row-level-security", "rbac", "retrieval-augmented-generation"],
    faqs: [
      {
        q: "Is multi-tenancy less secure than single-tenant?",
        a: "Done properly, isolation is enforced by the database and tested continuously, which is often stronger in practice than many separately-maintained single-tenant installs.",
      },
      {
        q: "Which isolation pattern should a new SaaS pick?",
        a: "Shared schema with RLS is the pragmatic default: cheapest to operate with database-enforced isolation. Escalate to schema- or database-per-tenant when contracts or regulation demand it.",
      },
      {
        q: "What usually leaks first in bad multi-tenant systems?",
        a: "Side channels: a cache keyed without tenant, a global search index, or filenames in shared storage. Isolation is a property of the whole system, not just the main tables.",
      },
    ],
    aegibit: {
      text: "Cortex and Vestiq are multi-tenant by construction: tenant ids on every row, RLS enforced, isolation tested, one platform serving many businesses safely.",
      href: "/products/cortex",
      label: "Cortex's multi-tenant design",
    },
  },
  {
    slug: "petty-cash-management",
    term: "Petty Cash Management",
    short:
      "The controlled handling of small day-to-day cash expenses (fuel, repairs, refreshments, courier) across a business, with documented vouchers, approvals, and reconciliation.",
    why:
      "Individually tiny, petty cash flows compound into serious money across branches and months, and they are the least-documented money in most SMBs. It matters because leakage hides here: duplicate claims, missing receipts, unlogged advances, and month-end reconciliations that never quite balance, quietly taxing the business.",
    how:
      "A disciplined loop: every spend gets a voucher at the moment it happens (who, what, where, amount, proof), an approver within a defined limit signs off, entries post to a ledger by branch and category, and reconciliation compares cash on hand against the ledger regularly. Digital systems add photo receipts, geo-tagged capture, tiered approvals, and instant HQ visibility.",
    example:
      "A seven-branch dealership handled fuel and workshop spends on paper; HQ learned each branch's numbers five to nine days late, and disputes were memory contests. Moving to digital vouchers with photo, location, and timestamp at capture, tiered approvals, and same-day dashboards made every rupee attributable, and month-end audit preparation dropped from days to hours.",
    mistakes: [
      "Recording expenses at day-end from memory instead of at the moment of spend",
      "One cash box, many hands, no per-person accountability",
      "Approvals without limits, or limits without enforcement",
      "Reconciliation only when something already feels wrong",
    ],
    bestPractices: [
      "Capture at source: voucher with proof photo, time, and place, before cash leaves the drawer",
      "Tiered approval limits matching roles, escalation beyond them",
      "Immutable records: corrections happen by new entries, not silent edits",
      "Weekly branch reconciliation with HQ visibility into every branch, same day",
    ],
    related: ["audit-log", "rbac", "cpq"],
    faqs: [
      {
        q: "How much leakage do businesses actually suffer?",
        a: "Honest answer: it varies widely, and unmeasured means unknown, which is the true problem. The consistent pattern is that documentation at source plus visibility shrinks disputes and unexplained gaps immediately.",
      },
      {
        q: "Is a spreadsheet enough for petty cash?",
        a: "It records; it does not control. Spreadsheets lack capture-at-source proof, enforced approvals, and immutability, the three properties that actually prevent leakage.",
      },
      {
        q: "What is the fastest first improvement?",
        a: "Vouchers with photo and timestamp at the moment of spend. That single habit converts arguments about memory into checks of evidence.",
      },
    ],
    aegibit: {
      text: "PayMint is AEGIBIT's petty-cash and expense platform for multi-branch businesses: 30-second capture with photo and geo-tag, tiered approvals, immutable logs, Tally-ready exports.",
      href: "/products/paymint",
      label: "How PayMint controls branch expenses",
    },
  },
  {
    slug: "cpq",
    term: "CPQ (Configure, Price, Quote)",
    short:
      "Software that helps sales teams configure a product or service, price it correctly under current rules, and generate an accurate quotation, fast and without spreadsheet archaeology.",
    why:
      "Quoting is where deals stall and margins quietly die: wrong prices from old sheets, discounts beyond authority, taxes miscomputed, and days lost to internal back-and-forth. CPQ matters because speed and accuracy at the quote stage are conversion levers, the first credible, correct quote often wins.",
    how:
      "A CPQ system encodes the catalog, pricing rules, tax logic (like GST), and discount authority. Sales picks the configuration; the system computes price with current rules, routes approvals when a discount exceeds the rep's tier, and produces a versioned, branded quote document. Versioning preserves negotiation history; integration hands accepted quotes to invoicing.",
    example:
      "A rep quotes a multi-item deal with a special discount. Instead of a spreadsheet and three phone calls, the system prices from the live catalog, computes GST correctly, flags the discount for a manager's one-tap approval, and emails a numbered quote, minutes, not days, with every version on record.",
    mistakes: [
      "Pricing from personal spreadsheets that drift from the real catalog",
      "Discount authority by trust rather than enforced tiers",
      "Quotes as untracked documents, no versions, no status, no learning",
      "Divorcing quoting from invoicing so accepted quotes are retyped (and mistyped)",
    ],
    bestPractices: [
      "Single source of truth for catalog, prices, and tax rules",
      "Enforced discount tiers with logged approvals",
      "Versioned quotes with status tracking from draft to accepted",
      "Straight-through flow from accepted quote to invoice",
    ],
    related: ["petty-cash-management", "rbac", "multi-tenant-architecture"],
    faqs: [
      {
        q: "Is CPQ only for enterprises?",
        a: "No. Any business quoting configurable work, dealerships, agencies, equipment sellers, wholesalers, bleeds time and margin at this stage. SMB-shaped CPQ pays back quickly.",
      },
      {
        q: "How does CPQ handle GST?",
        a: "Good systems compute tax from the rules (rates, intra- versus inter-state splits) rather than trusting manual entry, so quotes and downstream invoices stay consistent and compliant.",
      },
      {
        q: "What connects CPQ to CRM?",
        a: "Quotes are pipeline events: which deals received quotes, at what values, with what outcomes. CPQ inside a CRM turns quoting from paperwork into conversion data.",
      },
    ],
    aegibit: {
      text: "AEGIBIT Cortex includes native CPQ: catalog-driven quotations with GST, versioning, and tiered discount approvals, inside the CRM rather than bolted on.",
      href: "/products/cortex",
      label: "Quotation and approvals in Cortex",
    },
  },
  {
    slug: "otp-authentication",
    term: "OTP Authentication (One-Time Password)",
    short:
      "A login method where a short-lived single-use code (sent by SMS, app, or email, or generated on-device) proves the user controls a registered factor, replacing or supplementing passwords.",
    why:
      "Passwords get reused, phished, and shared, especially on shared shop-floor devices. OTP matters because it removes the stored-secret problem for frontline teams: nothing to remember, nothing to leak in a database dump, and each code dies after use. For field workforces in retail and dealerships, phone-plus-OTP is often both more secure and more usable than passwords.",
    how:
      "The user identifies (typically by phone number), the system generates a code bound to that identity with a short expiry and single-use flag, delivers it, and verifies the entry. Sound implementations rate-limit attempts and sends, hash stored codes, bind verification to a session, and then protect the session token properly (secure storage, rotation). TOTP apps generate codes on-device, avoiding SMS interception for higher-risk uses.",
    example:
      "A dealership's sales app onboards staff with phone and OTP: no passwords to forget or share between shifts. Session tokens live in the device's secure store with automatic refresh. When a person leaves, deactivating their number ends access, cleanly, with every session's actions attributed to them in the log.",
    mistakes: [
      "No rate limiting, letting attackers brute-force codes or drain SMS budgets",
      "Long-lived or reusable codes, which quietly become passwords again",
      "Treating a verified OTP as the end: unprotected session tokens undo the win",
      "Using SMS OTP alone for high-value admin actions where interception matters",
    ],
    bestPractices: [
      "Short expiry, single use, rate limits on both attempts and sends",
      "Store only hashed codes; log verification events",
      "Protect sessions after login: secure storage, rotation, revocation",
      "Escalate to TOTP or additional factors for administrative or high-value access",
    ],
    related: ["zero-trust", "rbac", "audit-log"],
    faqs: [
      {
        q: "Is OTP the same as two-factor authentication?",
        a: "OTP is a factor. Used alone it is single-factor (possession); combined with a password or biometric it forms 2FA. For many frontline flows, possession-based OTP alone already beats shared passwords.",
      },
      {
        q: "Is SMS OTP secure enough?",
        a: "For frontline business apps, generally yes with rate limiting and short expiry. For administrator access or high-value transactions, prefer authenticator apps or hardware factors.",
      },
      {
        q: "Why do field apps prefer phone-plus-OTP?",
        a: "Zero password reuse, zero sharing between shifts, instant revocation by deactivating the number, and clean per-person attribution in audit logs.",
      },
    ],
    aegibit: {
      text: "LeadSync signs dealership staff in with phone plus OTP, session tokens in the device secure store, no passwords to leak on a busy showroom floor.",
      href: "/products/leadsync",
      label: "LeadSync's authentication design",
    },
  },
  {
    slug: "anomaly-detection",
    term: "Anomaly Detection",
    short:
      "Techniques that identify patterns deviating from expected behavior, unusual logins, odd transaction shapes, abnormal usage, so humans can investigate before small oddities become incidents.",
    why:
      "Rules catch what you predicted; anomalies are what you did not. It matters because fraud, abuse, and failures usually announce themselves first as statistical weirdness: an approval at 3 a.m., a branch's expenses doubling, a user suddenly exporting everything. Catching deviation early converts incidents into questions.",
    how:
      "Baselines are learned from historical behavior (per user, branch, or system), then live activity is scored against them, statistically (thresholds, distributions) or with machine learning for complex patterns. Good systems route scored anomalies to humans with context, tune to keep false positives tolerable, and feed confirmed outcomes back to improve the model.",
    example:
      "An expense platform learns each branch's rhythm. One branch's fuel vouchers spike far beyond baseline in a week; the system flags it with the comparison attached. The review takes minutes: either a legitimate campaign explains it, or a conversation begins, weeks earlier than a quarterly audit would have noticed.",
    mistakes: [
      "Alerting on everything, training humans to ignore the channel",
      "Static thresholds forever, businesses drift and baselines must follow",
      "Anomaly scores without context, flags nobody can act on",
      "Using detection as the only defence instead of a layer atop controls and logs",
    ],
    bestPractices: [
      "Baseline per entity (user, branch, tenant), not one global average",
      "Deliver anomalies with the evidence that made them anomalous",
      "Tune alert volume to what reviewers can genuinely investigate",
      "Close the loop: confirmed outcomes retrain the detector",
    ],
    related: ["audit-log", "zero-trust", "petty-cash-management"],
    faqs: [
      {
        q: "Do small businesses need anomaly detection?",
        a: "At small scale, simple per-entity baselines and review of outliers already deliver most of the value, sophistication can grow with data volume.",
      },
      {
        q: "Machine learning or rules?",
        a: "Both: rules for known-bad patterns, statistical or learned baselines for the unknown. Rules are explainable; learning finds what rules cannot enumerate.",
      },
      {
        q: "What data does it need?",
        a: "Reliable event history, which is why immutable audit logs come first. Detection is only as good as the record it studies.",
      },
    ],
    aegibit: {
      text: "AEGIBIT's platforms are built log-first, the foundation anomaly detection needs, with per-branch visibility that makes deviations obvious early.",
      href: "/security",
      label: "AEGIBIT's security engineering",
    },
  },
];

export function getTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.slug === slug);
}
