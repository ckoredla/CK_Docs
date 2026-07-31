# Northbound Labs visual audit

Audit date: 2026-07-30. Scope: `src/components/publication`, legacy publication helpers, rendered output for 140 articles, and the shared CSS in `app/publication-*.css`.

## Finding

The current system is responsive after the namespace repair, but it is not publication quality. It selects a family from keywords and rotates a variant; it does not begin with the technical question. Most components substitute article tags into a fixed composition. That produces visual variety in code without useful variety in explanation.

The system should remain unchanged during this sprint and be treated as deprecated for new editorial work. Migration requires human review figure by figure.

| Component | Type | Uses | Usefulness | Uniqueness | Responsive quality | Recommendation | Reason |
|---|---:|---:|---|---|---|---|---|
| `ArchitectureCanvas` | layered boxes | 38 | 2/5 | 2/5 | acceptable | redesign | Same generic evidence/context/authority layers regardless of system; weak protocol, cardinality, and flow semantics. |
| `TopologyCanvas` | icon chain | 31 | 1/5 | 1/5 | acceptable | deprecate | Five-item chain restates a path; no boundary, interface, failure path, or transport semantics. |
| `DashboardCanvas` | KPI cards + bars | 70 | 1/5 | 1/5 | good | deprecate | Repeated fabricated values (`94%`, `18`, `27m`, `98.6%`) are insufficiently prominent as illustrative and unrelated to most topics. |
| `TimelineCanvas` | milestone bars | 85 | 1/5 | 1/5 | good | deprecate | Repeats five generic stages; lacks dates, duration, dependency, critical path, and exception states. |
| `DecisionTreeCanvas` | branching boxes | 37 | 2/5 | 2/5 | acceptable | redesign | Valid form for authority questions, but generic applicability branches do not answer article-specific decisions. |
| `HeatmapCanvas` | cohort matrix | 34 | 1/5 | 2/5 | good | deprecate | Cells are algorithmic decoration, not evidence; fleet labels and values are invented. |
| `ServiceBlueprintCanvas` | lane table | 25 | 2/5 | 2/5 | acceptable | redesign | Potentially useful for workflows, but current lanes and steps are generic and lack handoffs, evidence, and failure recovery. |
| `JourneyMapCanvas` | experience curve | 19 | 1/5 | 2/5 | weak | deprecate | Arbitrary vertical positions and generic “Detect / Understand / Act” labels convey no defensible technical information. |
| `KnowledgeGraphCanvas` | node cluster | 23 | 2/5 | 2/5 | weak | redesign | Relevant to configuration/evidence topics, but relationships are not routed, typed, effective-dated, or source-qualified. |
| `AircraftCanvas` | aircraft icon + callouts | 34 | 1/5 | 1/5 | acceptable | deprecate | Not a functional aircraft diagram; it cannot explain ATA components, signals, redundancy, or maintenance interpretation. |
| `MetricsCanvas` | decorative distribution | 27 | 1/5 | 1/5 | good | deprecate | Fixed synthetic distribution has no units, cohort definition, sample basis, or relationship to the article. |
| `InfographicCanvas` | three editorial cards | 27 | 2/5 | 1/5 | good | deprecate | Clear but generic; it restates evidence categories and does not explain a technical mechanism. |
| `RiskCanvas` | likelihood/consequence matrix | 71 | 2/5 | 1/5 | good | restrict | Valid only for an explicit risk question with defined scales; currently overused and not tied to assessed hazards. |
| `TableCanvas` | comparison table | 39 | 2/5 | 1/5 | good | restrict | Tables are useful for exact mappings, but the current rows repeat the same governance vocabulary. |
| `VisualFrame` | shared frame | 560 | 3/5 | 1/5 | good | retain selectively | Caption and semantic figure are useful; mandatory title-bar treatment makes every page feel templated. |
| `PublicationVisual` / `catalog` | keyword selector | 560 | 1/5 | 1/5 | n/a | deprecate | Chooses by keyword/hash instead of editorial question and can assign semantically wrong forms. |
| `ArchitectureFigure` / `WorkflowFigure` | legacy wrappers | negligible | 2/5 | 1/5 | unknown | consolidate later | Thin aliases provide no accessibility or quality contract. |

## Recurring defects

- Four figures are injected into every article whether the narrative needs four or not.
- Article title is repeated in each figure header, consuming space without orientation value.
- Dashboard and analytical values are illustrative but the disclaimer sits only in captions or is absent.
- Fixed labels make unrelated articles appear derived from one prompt template.
- Variant A/B/C changes geometry or color, not the information model.
- Architecture, topology, aircraft, and knowledge-graph components omit interface contracts and typed relationships.
- Timelines lack a scale; heatmaps lack a legend and source; charts lack units and cohort definitions.
- Absolute positioning in knowledge graphs is fragile on narrow screens.
- Visuals frequently restate prose instead of exposing a relationship that prose cannot show efficiently.

## Article usage

Rendered usage counts are listed above. Examples are recorded from the first five rendered consumers per family during audit; the complete set is reproducible from `data-visual-family` in built article HTML. The most overused families are timeline (85), risk (71), dashboard (70), table (39), and architecture (38).

## Retain, redesign, deprecate

- Retain: semantic `<figure>`, captions, restrained icon use, print-safe colors, and the fixed namespace convention.
- Redesign: architecture, decision tree, service blueprint, and knowledge graph only when a concrete question warrants them.
- Restrict: risk matrices and tables to explicit comparisons with declared scales and sources.
- Deprecate for new work: automatic family selection and all generic tag-driven canvases.

## Human-review requirement

Automated checks can detect missing labels, IDs, captions, disclaimers, and overflow. They cannot determine whether a figure teaches, whether an engineering audience would trust it, or whether it is better than a paragraph. Those remain checklist decisions by an editor and a domain reviewer.
