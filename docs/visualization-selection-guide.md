# Visualization selection guide

Select the figure only after writing the technical question in one sentence. If the answer is a short list or one fact, use prose—not a diagram.

| Technical question | Prefer | Avoid |
|---|---|---|
| How do aircraft events reach cloud consumers? | streaming topology, sequence, lineage, protocol/boundary architecture | heatmap, journey map, KPI cards |
| Where does human approval occur? | swimlane, authority boundary, decision tree, state transition | generic flowchart, decorative timeline |
| Which failures dominate? | Pareto, fault tree, failure distribution, severity-frequency matrix | architecture diagram, metric-card wall |
| How does maintenance progress over time? | milestone/dependency timeline, state machine, critical path | unscaled five-step strip |
| How do parts and rotables move? | Sankey, inventory network, custody lifecycle | journey curve, generic table |
| How does an ATA system function? | functional block diagram, component topology, signal path, aircraft-zone map | aircraft silhouette with dots |

## Domain matrix

| Domain | Questions worth visualizing | Recommended forms | Required semantics |
|---|---|---|---|
| Aircraft telemetry | transport, ordering, validation, replay | reference architecture, sequence, lineage | boundaries, protocols, real-time/history, retry/DLQ |
| Maintenance control | responsibility and decision handoffs | operational swimlane, decision tree | roles, SLA, authority gate, evidence and record |
| Reliability | dominant causes and change over exposure | Pareto, trend, Weibull/removal-rate panel | units, cohort, exposure, sample size, uncertainty |
| Chronic defects | recurrence and escalation | lifecycle/state machine, case graph | thresholds, counter-evidence, feedback and closure |
| Work orders | creation through closure | state transition, swimlane | owner, status, findings, sign-off, system of record |
| Work packages | readiness and revision | document lifecycle, dependency map | effectivity, parts/tools, inspection, signature, audit |
| Technical records | custody and authority | lineage, entity relationship, document state | revision, signature, source, completeness, correction |
| Parts | location, custody, repair loop | Sankey, network, rotable lifecycle | serial identity, quarantine, pool, vendor, traceability |
| Planning | schedule and constraints | Gantt, critical path, capacity board | duration, dependency, resource, deadline, exception |
| AWS architecture | service boundaries and data paths | regional reference architecture, deployment view | trust/account boundaries, services, interfaces, resilience |
| Applied AI | evidence to suggestion to decision | AI decision architecture, retrieval lineage | provenance, model boundary, confidence, abstention, audit |
| Governance | claims, controls, owners | assurance case, RACI/authority map, control matrix | claim-evidence links, approval, monitoring, withdrawal |
| Cybersecurity | trust and attack paths | threat model, trust-boundary architecture, attack tree | identity, trust zone, control, data classification, failure path |
| Observability | health and drill-down | operational dashboard, service map, trace waterfall | SLO, units, time range, baseline, failure samples, ownership |
| ATA systems | physical/functional interaction | functional block diagram, signal path, fault isolation tree | component identity, sensor/control paths, messages, interpretation |

## Selection rules

1. State the question and intended decision.
2. Identify whether the relationship is spatial, temporal, hierarchical, quantitative, causal, or networked.
3. Select the smallest visual form that preserves that relationship.
4. Define evidence status: recorded, derived, illustrative, or proposed.
5. Label boundaries, units, direction, authority, and exception paths.
6. Test at desktop, tablet, mobile, and print widths.
7. Compare with the previous five figures. Similar silhouette requires a deliberate reason.
8. Apply the review checklist. Any “no” means remove or redesign.

## Dependency policy

The showcase uses native React, HTML, CSS, and SVG plus the existing Lucide package. No new library is justified: the ten figures have bounded data and deliberate static layouts. A graph-layout or chart library should be added later only when real variable-size data makes hand-authored layout unreliable.
