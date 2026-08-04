# AGOS Core Charter

AGOS is split into a FROZEN CORE and EVOLVING CAPABILITIES (Rahul's
architecture, 2026-08-04). Protecting this separation is what lets the
system support whatever AEGIBIT builds over the next decade without
rewriting how the company reasons.

## The Core (stable, changes need founder review + strong justification)

| Component | File(s) | Role |
| --- | --- | --- |
| Business DNA | `dna.json` | The constitution. Who AEGIBIT is. Never tuned by machines. |
| Strategy Tree | `objectives.json` | Goals -> initiatives -> objectives + business mode + resources. Founder-edited. |
| Evaluator Board | `evaluators.mjs` | Seven+ single-responsibility judges. Policy holds veto. |
| Decision Aggregator | `engine.mjs` | Combines the board under bounded config rules. |
| Work Queue | `queue.mjs`, `queue.json` | Lifecycle-tracked, priority-ranked pending work. |
| Asset Registry | `assets.mjs`, `assets.json` | Completed work becomes measurable assets, not forgotten files. |
| Decision Memory | `decisions.jsonl` | Append-only ledger with evidence. Never rewritten. |
| Organizational Memory | `policies.json` | Adopted policies with the evidence and date behind them. |
| Founder Twin | `founder.mjs`, `founder-model.json` | Learns approval patterns; predicts, never replaces, the founder. |
| Learning Engine | `learn.mjs` | Weekly recalibration within `config.json` bounds. Honest no-op on sparse data. |
| Capability Registry | `capabilities.json` | The plug-in socket. |
| Scheduler | `run.mjs` + `agos.yml` | Nightly loop with a worth-doing gate; grows adaptive signals over time. |

Core change policy: PR must state WHY the core (not a capability)
must change, and Rahul merges personally. The Learning Engine may only
touch `config.json` within `weightBounds`. Nothing may touch `dna.json`.

## Capabilities (constantly expanding, plug in via capabilities.json)

SEO, GEO, content, sales, reputation, security intelligence, client
success, product intelligence, and every future product (Cortex, HRMS,
CRM, finance...). A capability registers inputs, outputs, permissions,
risk level, dependencies, metrics, and owner. Capabilities may evolve
freely; they may never bypass the core's evaluation path.
