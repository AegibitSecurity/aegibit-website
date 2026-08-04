# ADR-002: Every capability must name its primary KPI

Date: 2026-08-04
Status: Accepted
Deciders: Rahul Mondal (founder), Aira (co-founder)

## Decision

A capability is only accepted into the registry if it names the
measurable business metric it improves (`kpi` field in
capabilities.json). The Policy evaluator vetoes proposals whose
capability has no declared KPI.

This is a core change (Policy Engine + Capability Registry), made
under the ADR process ADR-001 established, and is the LAST core change
of the design era.

## Why

"What measurable business metric will improve?" is the acceptance
question for all future work. A capability that cannot answer it is
not ready to be built. Enforcing this mechanically keeps the rule
alive after the people who made it stop thinking about it.

## Consequences

- capabilities.json gains a required `kpi` per capability.
- policyEvaluator gains a kpi-presence check (few lines, evidence
  logged).
- Future capability proposals without a KPI are vetoed at evaluation,
  not debated in reviews.
