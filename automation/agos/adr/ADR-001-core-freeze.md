# ADR-001: AGOS Core v1.0 Architecture Frozen

Date: 2026-08-04
Status: Accepted
Deciders: Rahul Mondal (founder), Aira (co-founder)

## Decision

The AGOS core contract is FROZEN at v1.0:

Business DNA · Decision Engine (Evaluator Board + Aggregator) ·
Knowledge Graph (Aira KB flywheel) · Decision Memory (ledger) ·
Learning Engine · Policy Engine · Capability Registry · Resource
Manager · Scheduler · Founder Twin · Evidence Layer · Asset Registry ·
Organizational Memory · Executive Memory

From this date, ANY change to a core component requires an
Architecture Decision Record in this directory, stating the problem,
the decision, the alternatives considered, and the measurable
consequence, reviewed and merged personally by the founder. Code
commits alone are not sufficient.

## Why

The architecture is now sufficient to build a company on. Every
engineering week from here must increase one of exactly three things:
Knowledge, Evidence, or Revenue. Competitive advantage now comes from
execution and compounding, not additional architecture.

## Consequences

- Engineering effort shifts almost entirely to capabilities, each of
  which must name its primary KPI before acceptance (ADR-002).
- Evidence Before Optimization becomes a constitutional principle:
  never optimize what has not been measured.
- Every automation must leave the company smarter than it found it:
  if a run leaves no evidence, no reusable knowledge, no measurable
  outcome, and no improvement to future decisions, it did not
  contribute and should be removed.
