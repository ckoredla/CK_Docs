import type { PublicationVisualContext, VisualRole } from './types';

/** Hand-authored editorial diagrams for the fifteen most recent issue dates.
 * Historical issues and all publication metadata remain untouched. */
type Shape = 'event'|'swimlane'|'comparison'|'loop'|'stack'|'architecture'|'state'|'gate'|'knowledge';
type EditorialSpec = {heading:string;shape:Shape;stages:string[];checks:string[];exceptions:string[]};
const raw: Record<string,[string,Shape,string,string,string]> = {
  "2026-08-maintenance-event-ledger": [
    "Event ledger and replay",
    "event",
    "Aircraft events|Source envelope|Immutable ledger|Derived consumers",
    "Validate identifiers|Idempotent ingest|Replay by offset|Retain original evidence",
    "Bad schema → quarantine|Duplicate → deduplicate|Consumer lag → replay"
  ],
  "2026-08-digital-shift-handover": [
    "Shift-handover evidence contract",
    "swimlane",
    "Outgoing team|Open defects + evidence|Acknowledged handover|Incoming team",
    "Open work owner|Evidence freshness|Read-back acknowledgement|Escalation remains visible",
    "Missing owner → block closure|Unacknowledged item → escalate"
  ],
  "2026-08-exposure-normalized-reliability": [
    "Exposure-based reliability",
    "comparison",
    "Defect and removal events|Aircraft cycles + hours|Effectivity cohorts|Rate with uncertainty",
    "Link event to aircraft|Normalize exposure|Segment configuration|Review sample limitations",
    "No exposure → no rate|Mixed cohorts → split analysis"
  ],
  "2026-08-post-maintenance-validation": [
    "Post-maintenance validation loop",
    "loop",
    "Maintenance action|Expected effect|Observed post-action signal|Outcome adjudication",
    "Capture intervention time|Compare prior context|Confirm operating conditions|Human adjudication",
    "No observation → pending|Repeat symptom → investigate"
  ],
  "2026-08-maintenance-observability": [
    "Observability and failure isolation",
    "stack",
    "Source freshness|Contract validation|Pipeline processing|Decision product",
    "Lag and throughput|Schema rejections|Trace correlation|Recovery ownership",
    "Stale feed → alert|Bad record → quarantine|Lost trace → investigate"
  ],
  "2026-07-aircraft-maintenance-intelligence-platform": [
    "Maintenance intelligence boundaries",
    "architecture",
    "Aircraft + MRO systems|Governed ingestion|Evidence and context store|Reviewer applications",
    "Source lineage|Identity + effectivity|Model provenance|Role-authorized disposition",
    "Failed join → review queue|Uncertain inference → abstain"
  ],
  "2026-09-digital-work-package-orchestration": [
    "Controlled work package lifecycle",
    "state",
    "Scope and effectivity|Plan + readiness|Execution + findings|Inspection + signed close",
    "Revision lock|Parts and tooling|Offline reconciliation|Qualified signatures",
    "Revision conflict → replan|Failed inspection → reopen"
  ],
  "2026-06-ai-assisted-maintenance-control": [
    "AI authority separation",
    "swimlane",
    "Recorded aircraft evidence|Assisted synthesis|Controller review|Approved action + record",
    "Cited sources|Effectivity check|Disclosed uncertainty|Named decision owner",
    "Uncited claim → reject|Ambiguity → abstain"
  ],
  "2026-10-maintenance-ai-governance": [
    "Model assurance gates",
    "gate",
    "Use-case risk|Evaluation evidence|Model council review|Restricted release + monitoring",
    "Data suitability|Adversarial tests|Rollback criteria|Accountable sign-off",
    "Failed gate → do not release|Drift → suspend and review"
  ],
  "ai-aircraft-maintenance": [
    "AI-supported maintenance workflow",
    "architecture",
    "Aircraft observations|Signal engineering|AI-assisted interpretation|Engineering disposition",
    "Purpose-bound features|Traceable evidence|Measured false alarms|Qualified review",
    "Low confidence → abstain|Model drift → reassess"
  ],
  "2026-10-multimodal-maintenance-evidence": [
    "Multimodal evidence alignment",
    "comparison",
    "Images + capture context|Aircraft configuration|Technical records|Corroborated finding",
    "Capture scale|Time alignment|Effectivity|Inspector judgement",
    "Poor image → recapture|Conflicting sources → review"
  ],
  "2026-04-maintenance-knowledge-retrieval": [
    "Effectivity-aware knowledge retrieval",
    "knowledge",
    "User question|Approved source revisions|Applicability filter|Cited answer or abstention",
    "Document provenance|Revision validity|Aircraft effectivity|Claim-to-citation map",
    "Wrong effectivity → exclude|No authority → abstain"
  ],
  "2026-03-ai-agent-assurance": [
    "Agent tool-access control",
    "gate",
    "Scoped user intent|Tool permission boundary|Simulation + evaluation|Human-authorized execution",
    "Least privilege|Tool-call audit|Injection tests|Kill switch",
    "Untrusted input → isolate|Policy failure → halt"
  ],
  "2026-03-chronic-defect-intelligence": [
    "Chronic defect case formation",
    "knowledge",
    "Write-up history|Component + position|Corrective action chronology|Reviewed recurrence case",
    "Aircraft identity|Symptom normalization|Intervention windows|Engineering confirmation",
    "Text-only match → reject|Missing exposure → qualify"
  ],
  "2026-11-maintenance-outcome-learning": [
    "Maintenance outcome feedback",
    "loop",
    "Decision rationale|Maintenance performed|Subsequent observation|Reviewed effectiveness feedback",
    "Link action to evidence|Define follow-up window|Separate confounders|Update controls after review",
    "Unknown outcome → pending|Weak causality → no model update"
  ],
  "2026-09-telemetry-time-integrity": [
    "Two-clock telemetry provenance",
    "event",
    "Aircraft event timestamp|Network receipt timestamp|Validated event store|Replayable consumer view",
    "Retain source clock|Capture ingestion time|Bound lateness|Track corrections",
    "Clock skew → flag|Late event → reconcile|Conflicting sequence → review"
  ],
  "2026-09-maintenance-event-contracts": [
    "Governed maintenance event contracts",
    "architecture",
    "Authoritative MRO event|Schema + effectivity validation|Versioned event bus|Independent consumers",
    "Business event identity|Schema version|Provenance and quality|Consumer idempotency",
    "Unmapped field → quarantine|Breaking revision → version gate"
  ],
  "2026-09-reliability-alert-latency": [
    "Operational alert decision window",
    "event",
    "Aircraft event time|Evidence arrival and validation|Decision window classifier|Reviewed reliability alert",
    "Source-to-decision latency|Evidence freshness|Aircraft effectivity|Acknowledgement time",
    "Expired alert → historical analysis|Incomplete evidence → hold review"
  ]
};
const specs:Record<string,EditorialSpec>=Object.fromEntries(Object.entries(raw).map(([slug,[heading,shape,stages,checks,exceptions]])=>[slug,{heading,shape,stages:stages.split('|'),checks:checks.split('|'),exceptions:exceptions.split('|')}]));
export function hasEditorialFigure(slug:string){return Object.prototype.hasOwnProperty.call(specs,slug)}
const labels:Record<VisualRole,string>={hero:'System boundary',evidence:'Evidence contract',analysis:'Failure and exception path',decision:'Review and authority'};
export function EditorialFigure({context,role}:{context:PublicationVisualContext;role:VisualRole}){
  const spec=specs[context.slug];if(!spec)return null;
  const isHero=role==='hero';const lines=isHero?spec.stages:role==='evidence'?spec.checks:role==='analysis'?spec.exceptions:[spec.checks[0], 'Qualified reviewer verifies source and applicability', 'Authorized action and audit record'];
  const layout=role==='hero'?spec.shape:role==='analysis'?'exception':role==='decision'?'authority':'evidence';
  return <figure className={`nbl-editorial nbl-editorial--${layout}`} data-visual-family={`editorial-${spec.shape}-${role}`} data-visual-profile="editorial-curated" data-visual-question={`${spec.heading}: ${labels[role]}`} aria-label={`${spec.heading}: ${labels[role]}`}>
    <figcaption className="nbl-editorial__heading"><span className="nbl-editorial__eyebrow">{labels[role]}</span><strong>{spec.heading}</strong></figcaption>
    <ol className="nbl-editorial__sequence">{lines.map((value,index)=><li key={value} className="nbl-editorial__node">
      <span className="nbl-editorial__index" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
      <span>{value}</span>
    </li>)}</ol>
    <p className="nbl-editorial__note">{role==='analysis'?'Exceptions are routed for investigation; no automated maintenance disposition is implied.':role==='decision'?'The final maintenance determination remains with authorized personnel and approved records.':role==='evidence'?'Evidence requirements are architectural controls, not invented production measurements.':'Conceptual engineering design, showing critical data and authority boundaries rather than an as-built implementation.'}</p>
  </figure>;
}
