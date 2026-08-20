export type IssueExpansion = {
  operatingContext: string[];
  engineeringPractice: string[];
};

export const issueExpansions: Record<string, IssueExpansion> = {
  '2026-01-maintenance-decision-brief': {
    operatingContext: [
      'Consider an aircraft that reports an intermittent flight-control message shortly before departure. The controller may need the current defect, earlier occurrences, configuration changes, recent maintenance, dispatch constraints, and the effective technical references within minutes. Those facts live at different levels of authority and arrive with different freshness. The interface must help the controller establish what is known before it offers an interpretation.',
      'Build the brief against an evidence contract. At minimum, that means aircraft and flight identity, event and ingestion time, the configuration in effect, open and recent work, applicable source revisions, data-quality exceptions, and the role expected to disposition the case. If one of those fields is missing, the brief changes state. It does not fill the hole with plausible prose.',
      'Human-factors design matters as much as retrieval quality. Under interruption and shift turnover, reviewers need stable placement, concise labels, visible conflicts, and a clear distinction between observation, inference, and approved instruction. The product should reduce reconstruction effort without compressing away the cues that let an experienced controller challenge it.'
    ],
    engineeringPractice: [
      'A useful pilot begins with a decision that already has a recognizable start, owner, and disposition—for example, preparing a repeat-defect review before an aircraft arrives. Teams can replay completed cases, compare the brief with the evidence used by controllers, and record omissions, misleading emphasis, and unnecessary content. This evaluates the information product before model quality becomes the dominant conversation.',
      'Release criteria should cover evidence completeness, citation correctness, time to reconstruct the case, reviewer correction, and the rate at which the system abstains for a valid reason. Scenario testing should include stale documents, conflicting tail mappings, missing history, delayed telemetry, and a plausible but inapplicable prior case. A fast answer that hides one of these conditions is a failed brief.',
      'In production, every displayed claim should be reproducible from retained source identifiers and transformation versions. Review and override events belong in the operational trace, but they should not automatically become technical ground truth. A service owner should review recurring corrections and have authority to restrict the product when evidence quality or operating context moves outside its validated boundary.'
    ]
  },
  '2026-02-event-driven-aircraft-telemetry': {
    operatingContext: [
      'An aircraft event often crosses an onboard source, an edge or airline communications path, a ground receiver, a broker, several transformations, and multiple consumers. Clocks may disagree, connectivity may delay delivery, and the same payload may be retried. A platform that records only the final arrival has lost the temporal evidence needed to reconstruct the flight and explain downstream decisions.',
      'The event contract needs separate fields for source time, reception time, ingestion time, and processing time, plus stable aircraft, flight-leg, source, schema, and payload identifiers. Quality state should travel with the event. Consumers can then express whether they require low latency, complete flight context, strict per-aircraft ordering, or only eventual availability instead of assuming that one stream provides all four.',
      'Configuration enrichment is also time-dependent. A component position or aircraft mapping known today may not have been known when the event first arrived. The platform should retain the original envelope and store enrichment as a versioned interpretation so a correction can improve future analysis without rewriting the historical source record.'
    ],
    engineeringPractice: [
      'Implementation should start with failure semantics. Define how long the edge buffers, what happens when sequence gaps appear, which duplicate key makes consumers idempotent, where invalid payloads are quarantined, and who is allowed to repair and replay them. These decisions determine whether the backbone remains trustworthy during the conditions in which aircraft data is least tidy.',
      'Service objectives should distinguish transport health from aviation completeness. Broker latency, consumer lag, and error rate are necessary, but engineering also needs unresolved aircraft identity, missing flight segments, late-event distribution, schema rejection by source, and the percentage of flights that meet a stated evidence contract. That is the difference between an available pipeline and an available maintenance product.',
      'Before onboarding another feed, teams should prove that a retained raw event can be replayed through a new parser, that a duplicate cannot create a second maintenance case, and that an investigator can trace a displayed value back to the source envelope. Capacity tests should include burst arrival after connectivity restoration rather than only smooth laboratory throughput.'
    ]
  },
  '2026-03-chronic-defect-intelligence': {
    operatingContext: [
      'A repeat write-up is rarely repeated in identical words. One crew reports a symptom, another records an indication, and maintenance may replace a component whose later shop finding is inconclusive. Position swaps, software changes, deferred work, and operating exposure can separate related events or make unrelated events appear similar. Chronic-defect analysis is therefore case reconstruction, not document clustering.',
      'The analytical unit should be a candidate case with explicit inclusion reasons. Each event should show the identities, configuration interval, terminology mapping, temporal relationship, and rule or similarity feature that connected it. Counter-evidence—different position, incompatible modification state, dissimilar operating phase, or a confirmed alternative cause—belongs in the same view.',
      'Significance also requires a denominator. Five events across a high-utilization fleet do not carry the same implication as five events concentrated on one tail or component position. The product should expose counts, cycles or hours, fleet and tail concentration, operational consequence, corrective-action diversity, and the completeness of subsequent findings rather than collapsing them into one unexplained priority score.'
    ],
    engineeringPractice: [
      'Start the evaluation with cases reliability engineering has already adjudicated. Ask reviewers to reconstruct each event set without seeing the system grouping, then compare joins, omissions, and explanations. Sort the mistakes by identity quality, text quality, configuration change, and outcome availability. Otherwise, a single accuracy number will conceal the part that actually needs work.',
      'Workflow design must support merge, split, exclude, annotate, and escalate actions with rationale. Those edits improve the governed case and create evaluation evidence, but they should not immediately retrain a model. Label stewardship needs a review cadence because an early conclusion can change after shop findings or recurrence.',
      'Operational measures include time to assemble a case, percentage of events with resolved component identity, reviewer changes to membership, cases with missing outcome chains, and recurrence after an intervention. Formal chronicity thresholds and maintenance-program action remain with the operator’s approved reliability process and qualified personnel.'
    ]
  },
  '2026-04-maintenance-knowledge-retrieval': {
    operatingContext: [
      'Technical content is not one homogeneous library. Approved maintenance data, operator procedures, engineering orders, troubleshooting history, training material, and informal notes have different authority, effectivity, revision control, and permitted use. A retrieval system that ranks them together can produce a semantically impressive answer whose governing status is impossible to determine.',
      'Treat admission to the corpus as a controlled process. The document record needs identity, owner, revision, effective and withdrawal dates, aircraft or component applicability, approval state, access classification, and structural relationships. Warnings, cautions, prerequisites, tables, and figures must stay connected to the procedural text they qualify.',
      'At query time, role, aircraft configuration, component position, and document status become eligibility filters. Semantic ranking operates only after those constraints are resolved. If effectivity is unknown or qualifying sources conflict, the interface should present the conflict or abstain instead of asking generation to smooth it into one answer.'
    ],
    engineeringPractice: [
      'Evaluation needs a maintenance-specific test set. Each case should define eligible documents and revisions, required supporting passages, ineligible but tempting passages, expected conflicts, and an acceptable abstention outcome. Scores for retrieval recall, eligibility precision, citation correctness, and unsupported claims are more useful than a single measure of answer similarity.',
      'Change control is part of runtime safety. When a source is revised or withdrawn, teams need to know which indexed passages, cached answers, evaluations, and active user sessions are affected. The index should support reproducible snapshots so an audit can reconstruct what the product was permitted to retrieve when a reviewer used it.',
      'Start with one controlled collection and one task, such as locating applicable troubleshooting context. Put technical publications, engineering, maintenance users, security, and records owners in the same failure review. They will notice different problems, and all of them matter. Generated synthesis remains advisory; approved data and organizational procedures still govern the maintenance action.'
    ]
  },
  '2026-08-maintenance-observability': {
    operatingContext: [
      'Maintenance intelligence can fail while every infrastructure dashboard remains green. A tail mapping may be stale, a completed flight may be missing its final segment, a document revision may no longer be effective, or a recommendation may arrive after the controller has already made the decision. These are failures of meaning and workflow delivery rather than CPU, memory, or broker availability.',
      'The observable unit should be the decision path. A trace connects the source evidence, identity and configuration enrichment, transformations, rules or models, retrieved material, displayed result, user disposition, and later outcome. That trace allows operations teams to answer which aircraft and decisions were affected when a semantic contract or reference-data release was wrong.',
      'Service levels should state an operational promise: which evidence must be complete, how fresh it must be, for which fleet and decision, by what point in the workflow. Segmenting these measures prevents a healthy majority population from hiding persistent failures for one station, source, configuration, or operating regime.'
    ],
    engineeringPractice: [
      'A control room should combine infrastructure signals with source freshness, identity resolution, schema and semantic checks, model or rule behavior, workflow delivery, and reviewer corrections. Each alert needs an owner, affected population, diagnostic path, and safe degraded behavior. Without those fields, another dashboard only increases the time needed to understand an incident.',
      'Teams should test observability by injecting representative failures: delayed flight closure, duplicate events, a changed code meaning, stale effectivity, unavailable retrieval, and an inference response delivered after its deadline. The test passes when the product changes state visibly, identifies the impacted cases, and recovers without corrupting authoritative records.',
      'Use the daily review for live exceptions. Use the weekly product review for trends, recurring corrections, and error-budget consumption. After a significant incident, improve the evidence contract, monitors, and fallback workflow; restarting the service is only recovery, not corrective action. Apply retention and access controls to traces because they can join sensitive operational and personnel activity.'
    ]
  },
  '2026-09-digital-work-package-orchestration': {
    operatingContext: [
      'A heavy-maintenance or overnight package is a network of obligations: applicable tasks, access, labor and qualifications, tooling, material, engineering support, inspections, findings, records, and aircraft release dependencies. A PDF can describe work, but it cannot reliably expose which dependency changed or who owns the next action when execution diverges from plan.',
      'The orchestration model should treat state transitions as governed business events. Ready for release means that separately owned conditions have been evaluated against a controlled baseline. Active work may be interrupted by a finding, revision, access conflict, or unavailable part. Closure requires evidence that every originating task and non-routine branch reached an authorized disposition.',
      'Offline operation is not an edge case on the hangar floor. The client needs a clear controlled version, bounded actions while disconnected, retained signatures and evidence, and a conflict process when the server state has advanced. Quiet last-write-wins synchronization is unacceptable for work status or technical instructions.'
    ],
    engineeringPractice: [
      'Begin by mapping a real package from scope through records closeout. For each handoff, document the system of record, responsible role, entry criteria, output evidence, timing expectation, and recovery path. This often reveals that the first valuable release is shared dependency visibility rather than end-to-end automation.',
      'Integration events should name the business fact—task baseline released, material short, finding raised, engineering response issued, inspection accepted—rather than carry a generic update. Stable identifiers and idempotent consumers allow notifications and projections to be rebuilt without duplicating work or altering authoritative transactions.',
      'Measures should include readiness exceptions discovered after release, waiting time by dependency, revision-impact response, findings without owners, offline conflicts, record rejection, and closeout latency. Improvements should be reviewed with planning, production, engineering, materials, inspection, and records because optimizing one queue can simply move delay downstream.'
    ]
  },
  '2026-10-maintenance-ai-governance': {
    operatingContext: [
      'The same model can create very different risk depending on placement. A search aid used by an analyst, an alert ranked in maintenance control, and a generated recommendation inserted into an execution workflow differ in consequence, error visibility, time pressure, and opportunity for qualified review. Governance must classify the complete use case, not the underlying algorithm.',
      'The intake record needs to answer plain questions. What decision is being supported? Who sees the output? Which fleet or process can it affect? What is the worst credible error, and what happens when the service is unavailable? Recording the source authority, prohibited uses, review point, fallback, and owner gives the organization enough context to set proportionate controls.',
      'NIST AI RMF organizes continuing risk work around Govern, Map, Measure, and Manage, while EASA’s aviation AI work emphasizes a human-centric approach. For maintenance products, those principles translate into explicit operational boundaries, representative evaluation, monitored human interaction, and authority to restrict or withdraw a capability.'
    ],
    engineeringPractice: [
      'A release evidence case should connect claims to tests. It includes data lineage, eligibility controls, scenario coverage, cohort results, known limitations, human-factors findings, security and privacy review, monitoring, rollback, and named acceptance authority. High average accuracy cannot compensate for an untested consequential cohort or a workflow that encourages automation bias.',
      'Post-deployment review should examine abstention, unsupported output, citation failure, correction, override, delayed delivery, distribution change, and unexpected user behavior. Model changes, prompt changes, retrieval-policy changes, and workflow-placement changes can each alter risk and need configuration control even when the user-facing feature name stays the same.',
      'The operating test of governance is whether the organization can act when evidence degrades. A named owner must be able to restrict a cohort, revert a release, disable generation, or return to the manual process. Those actions should be rehearsed with maintenance users so the fallback is credible during real operational pressure.'
    ]
  },
  '2026-11-maintenance-outcome-learning': {
    operatingContext: [
      'Maintenance outcomes unfold over time. A recommendation may lead to inspection, troubleshooting, deferment, removal, shop evaluation, reinstallation, or no action; the original symptom may recur after several representative cycles. Selecting the first convenient downstream event as the label confuses workflow activity with technical confirmation.',
      'The outcome model should preserve a linked chain of observations and decisions. Every link has an identity, event time, source, accountable role, and degree of certainty. Confirmed, not confirmed, inconclusive, insufficient evidence, pending exposure, and revised are legitimate states. Unknown must remain visible because it describes the evidence, not an analytical failure.',
      'Several biases appear here. Cases that receive action are easier to observe than cases that are dismissed. Removed components are more likely to produce shop findings than components left installed. User feedback mixes technical judgment with timing and presentation. Report where labels are missing and how the available labels were obtained.',
    ],
    engineeringPractice: [
      'The first implementation step is manual reconstruction. Select a bounded set of cases and trace each from signal through later operation with maintenance, reliability, and data owners. Record where identity breaks, where systems use incompatible status terms, and which outcome can only be established through expert adjudication.',
      'Feedback should move at different cadences. Product teams can respond quickly to poor timing or confusing presentation. Model evaluation should wait for defined evidence windows and reviewed labels. Reliability programs may need still longer observation to judge recurrence or population-level change. Keeping these clocks separate prevents premature learning.',
      'Before outcomes are used for training, publish label definitions, coverage, revision behavior, cohort limitations, and inter-reviewer disagreement. Retraining should be a governed release with evaluation against fixed historical cases. The loop closes only when reviewed outcomes improve the product without allowing its own earlier predictions to manufacture their apparent correctness.'
    ]
  },
  '2026-12-maintenance-intelligence-operating-system': {
    operatingContext: [
      'A maintenance intelligence portfolio spans more than models. It includes source stewardship, aircraft and component identity, event history, controlled retrieval, decision interfaces, integrations, monitoring, outcome capture, governance, and the people who interpret evidence. If those capabilities are funded as isolated projects, each use case rebuilds partial infrastructure and creates another unsupported operational dependency.',
      'The durable unit of ownership is a decision product. It names a user and operating moment, an evidence contract, a bounded analytical service, an authority boundary, delivery and fallback behavior, outcome measures, and a service owner. Shared platform capabilities reduce duplication, while domain teams retain responsibility for technical meaning and workflow fit.',
      'Portfolio leadership needs visibility into both value and unresolved risk. Adoption alone is insufficient: a frequently used product can still rely on weak identities or encourage over-trust. Reviews should combine service reliability, evidence quality, user correction, decision timeliness, outcome coverage, incidents, limitations, and the cost of stewardship.'
    ],
    engineeringPractice: [
      'Deliver one or two decision products first, and build only the common capabilities they actually require. Write contracts at each boundary, retain source and transformation lineage, and prove that the displayed evidence can be reproduced. Later products earn reuse by sharing those contracts. Forcing every workflow into a universal platform usually creates a universal compromise.',
      'Operating forums should exist at several levels: daily service ownership, periodic domain product review, model or rule change control, and portfolio governance. Every forum needs explicit decisions and escalation paths. Data repair, source onboarding, outcome stewardship, security, and user training require durable capacity rather than temporary project assignments.',
      'Retirement is part of the architecture. A capability should be restricted or withdrawn when its source disappears, validated population changes, operational benefit is not demonstrated, or safer alternatives become available. Preserving the evidence and decision history while removing the active dependency is a mark of a mature operating system, not a failed innovation program.'
    ]
  }
};
