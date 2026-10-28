import type { PublicationMode, PublicationVisualContext, VisualRole, VisualVariant } from './types';

export type VisualFamily='aws-architecture'|'architecture'|'topology'|'dashboard'|'timeline'|'decision-tree'|'heatmap'|'service-blueprint'|'journey-map'|'knowledge-graph'|'aircraft'|'metrics'|'infographic'|'risk'|'table'|'lab-ai-authority'|'lab-aircraft-system'|'lab-defect-lifecycle'|'lab-maintenance-swimlane'|'lab-observability'|'lab-parts-network'|'lab-reliability'|'lab-telemetry-architecture'|'lab-telemetry-sequence'|'lab-work-package';
export type VisualProfile='cloud-platform'|'aircraft-system'|'component-lifecycle'|'material-planning'|'technical-records'|'work-execution'|'maintenance-control'|'defect-investigation'|'reliability-analysis'|'outcome-learning'|'inspection-ai'|'knowledge-assistance'|'ai-assurance'|'governance'|'general';
type RolePlan={family:VisualFamily;variant:VisualVariant;question:string};
type VisualPlan=Partial<Record<VisualRole,RolePlan>>;

const modes:PublicationMode[]=['research','briefing','handbook','field-guide','technical-manual','playbook','decision-record','case-study'];
const plan=(hero:RolePlan,evidence?:RolePlan,analysis?:RolePlan,decision?:RolePlan):VisualPlan=>({hero,evidence,analysis,decision});
const item=(family:VisualFamily,question:string,variant:VisualVariant='a'):RolePlan=>({family,question,variant});

const plans:Record<VisualProfile,VisualPlan>={
  'cloud-platform':plan(
    item('aws-architecture','Which AWS, airline, and MRO boundaries carry this workload from intake to an authoritative update?'),
    item('lab-telemetry-sequence','What happens to an event on success, validation failure, persistence, and retry?','b'),
    item('table','Which workload, recovery, evidence, and authority controls must be observable?')
  ),
  'aircraft-system':plan(
    item('aircraft','Which aircraft functions, signal paths, and configuration boundaries govern this system?'),
    item('topology','How do energy, commands, responses, and fault effects propagate?','b'),
    item('table','Which signal, configuration, evidence, and authority controls must be verified?'),
    item('timeline','Which evidence and review gates must be satisfied before maintenance action?')
  ),
  'component-lifecycle':plan(
    item('topology','How do component identity, condition, custody, and installed position move through the network?'),
    item('timeline','Which installation, removal, repair, modification, and release events establish technical status?'),
    item('knowledge-graph','Which aircraft, position, component, document, shop finding, and custody relationships must remain traceable?')
  ),
  'material-planning':plan(
    item('lab-parts-network','How do serviceable and unserviceable material move while identity and custody remain traceable?'),
    item('timeline','Which demand, allocation, transfer, repair, and replenishment events control availability?'),
    item('table','Which material decisions require lead-time, traceability, substitution, and service controls?')
  ),
  'technical-records':plan(
    item('knowledge-graph','Which governed identities and relationships connect the technical record?'),
    item('service-blueprint','How is evidence created, reviewed, corrected, signed, and accepted into the aircraft record?'),
    item('table','Which information classes require provenance, revision, signature, and authority controls?')
  ),
  'work-execution':plan(
    item('lab-work-package','How does controlled work become ready, survive revision, execute, and close into the aircraft record?'),
    item('timeline','Which task states, findings, inspections, and recovery gates control progression?'),
    item('decision-tree','Which conditions release work, open rework, require inspection, or prevent closure?')
  ),
  'maintenance-control':plan(
    item('lab-ai-authority','How can AI assemble a suggestion without crossing the boundary into maintenance authority?'),
    item('lab-maintenance-swimlane','Where do evidence, work, and authority move during a maintenance-control event?')
  ),
  'defect-investigation':plan(
    item('lab-defect-lifecycle','How does a recurrent discrepancy become a governed reliability case and return to monitoring?'),
    item('knowledge-graph','Which symptoms, positions, components, tasks, and findings belong to the candidate defect case?'),
    item('table','Which recurrence evidence distinguishes a governed defect case from a superficial similarity?')
  ),
  'reliability-analysis':plan(
    item('lab-reliability','Which causes dominate, is the exposure-normalized rate changing, and is evidence sufficient?'),
    item('timeline','How do events, maintenance actions, modification state, and confirmed outcomes relate over time?'),
    item('table','Which exposure, effectivity, finding, and outcome fields are required before comparing cohorts?')
  ),
  'outcome-learning':plan(
    item('service-blueprint','How does a maintenance decision become a confirmed outcome and a governed learning signal?'),
    item('timeline','Which operational, engineering, and program cadences consume the outcome?'),
    item('knowledge-graph','Which decision, action, component, finding, and operational outcome relationships close the learning loop?')
  ),
  'inspection-ai':plan(
    item('aircraft','Where is the inspection target, and which effectivity, access, and physical scale govern interpretation?'),
    item('journey-map','How do capture quality, localization, model review, measurement, and inspector authority interact?'),
    item('table','Which capture, effectivity, equipment, finding, and validation controls bound model use?'),
    item('decision-tree','When is visual evidence sufficient to screen, recapture, escalate, or abstain?')
  ),
  'knowledge-assistance':plan(
    item('knowledge-graph','Which documents, effectivity rules, aircraft history, and claims form the evidence context?'),
    item('service-blueprint','How do retrieval, citation, synthesis, user review, and correction work together?'),
    item('infographic','Which output is recorded fact, retrieved evidence, generated synthesis, or unsupported claim?'),
    item('decision-tree','When should the assistant answer with citations, request context, abstain, or escalate?')
  ),
  'ai-assurance':plan(
    item('architecture','Where do governed evidence, model inference, tool access, safeguards, and human authority sit?'),
    item('table','Which claims, tests, limitations, owners, and release controls must be traceable?'),
    item('service-blueprint','How do evaluation, release, monitoring, incident response, and human review operate together?'),
    item('decision-tree','Which evidence permits recommendation, restricted use, abstention, rollback, or escalation?')
  ),
  governance:plan(
    item('architecture','Where do governed evidence, controls, accountable owners, and release authority sit?'),
    item('table','Which requirement, evidence, owner, control, and review status must remain traceable?'),
    item('service-blueprint','How do assurance evidence, review, restriction, incident response, and corrective action connect?'),
    item('decision-tree','Which evidence permits release, restriction, rollback, or withdrawal?')
  ),
  general:plan(
    item('infographic','What is the essential engineering model the reader must retain?'),
    item('table','Which evidence classes, owners, and controls must be compared directly?')
  )
};

// The full 2017–2026 archive forms the premium visual tier. These plans use
// commissioned laboratory canvases and official AWS architecture components;
// generic card, matrix, and decorative dashboard families are intentionally
// excluded. The cutoff is verified by rendered-publication validation.
const premiumPlans:Record<VisualProfile,VisualPlan>={
  'cloud-platform':plan(item('aws-architecture','Which airline, AWS, data, failure, and authority boundaries define this workload?'),item('lab-telemetry-sequence','What happens on successful delivery, validation failure, retry, and replay?','b'),item('lab-observability','Where does the decision path become unhealthy, and which failed event should an operator inspect?','c'),item('lab-maintenance-swimlane','How do platform ownership, operational review, and authoritative record updates remain separate?')),
  'aircraft-system':plan(item('lab-aircraft-system','Which physical functions, signals, configuration, and maintenance interpretations govern the system?'),item('lab-reliability','Which causes, exposure, and evidence establish the engineering concern?','b'),item('lab-observability','Which signal or context failure makes the conclusion unreliable?','c'),item('lab-maintenance-swimlane','Where do approved data, troubleshooting evidence, and qualified action cross roles?')),
  'component-lifecycle':plan(item('lab-parts-network','How do serialized identity, condition, position, and custody move through the component network?'),item('lab-work-package','Which controlled records establish installation, removal, repair, and release status?','b'),item('lab-defect-lifecycle','How does component evidence become a governed reliability case?','c'),item('lab-maintenance-swimlane','Which handoffs preserve evidence and accountable authority?')),
  'material-planning':plan(item('lab-parts-network','How do demand, allocation, custody, repair, and serviceability interact?'),item('lab-reliability','Which uncertainty and exposure signals should influence material planning?','b'),item('lab-observability','Where can stale inventory, lead-time, or substitution data distort the decision?','c'),item('lab-maintenance-swimlane','How do planning, stores, engineering, and maintenance authority coordinate?')),
  'technical-records':plan(item('lab-work-package','How is controlled evidence created, revised, signed, and accepted into the aircraft record?'),item('lab-maintenance-swimlane','Which roles create, review, correct, and authorize each record state?','b'),item('lab-observability','Where can provenance, effectivity, signature, or synchronization fail?','c')),
  'work-execution':plan(item('lab-work-package','How does controlled work become ready, execute, survive revision, and close?'),item('lab-maintenance-swimlane','Where do task evidence, findings, inspection, and authority move?','b'),item('lab-observability','Which readiness, offline, revision, or reconciliation failures block progression?','c')),
  'maintenance-control':plan(item('lab-ai-authority','How can software assist maintenance control without acquiring maintenance authority?'),item('lab-maintenance-swimlane','Where do evidence, work, escalation, and authority move during control?','b'),item('lab-observability','Which evidence or workflow failure should change the operational response?','c')),
  'defect-investigation':plan(item('lab-defect-lifecycle','How does a recurrent discrepancy become a governed case and return to monitoring?'),item('lab-reliability','Which recurrence, exposure, and configuration evidence supports the case?','b'),item('lab-observability','Where can identity, correlation, or outcome evidence break the analysis?','c'),item('lab-maintenance-swimlane','Which roles review and record the engineering disposition?')),
  'reliability-analysis':plan(item('lab-reliability','Which causes dominate, is the exposure-normalized rate changing, and is evidence sufficient?'),item('lab-defect-lifecycle','How do events, interventions, findings, and outcomes form a governed reliability case?','b'),item('lab-observability','Which population, latency, lineage, or quality failure invalidates the signal?','c'),item('lab-maintenance-swimlane','How does a reliability signal become reviewed program action?')),
  'outcome-learning':plan(item('lab-defect-lifecycle','How does a decision become a confirmed outcome and governed learning signal?'),item('lab-reliability','Which evidence distinguishes effectiveness from coincidence?','b'),item('lab-observability','Where can missing follow-up or broken linkage bias learning?','c'),item('lab-maintenance-swimlane','Which teams adjudicate and release a resulting change?')),
  'inspection-ai':plan(item('lab-aircraft-system','Where is the inspection target and which physical context governs interpretation?'),item('lab-ai-authority','How do capture, inference, measurement, and inspector authority remain distinct?','b'),item('lab-observability','Which capture or model-quality failure requires recapture or abstention?','c'),item('lab-maintenance-swimlane','How is a reviewed finding recorded through approved workflow?')),
  'knowledge-assistance':plan(item('lab-telemetry-architecture','How do governed sources, applicability filters, retrieval, synthesis, and citations form an evidence path?'),item('lab-work-package','Which source, revision, effectivity, and claim links must remain inspectable?','b'),item('lab-reliability','Which evidence gaps and uncertainty conditions require qualification or abstention?','c'),item('lab-defect-lifecycle','How do user challenge, correction, and reviewed outcomes improve the next retrieval?')),
  'ai-assurance':plan(item('lab-ai-authority','Where must model inference, safeguards, tool access, and human authority remain separate?'),item('lab-observability','Which evaluation, drift, incident, or control evidence governs continued use?','b'),item('lab-maintenance-swimlane','How do evaluation, release, monitoring, and incident response cross accountable roles?','c')),
  governance:plan(item('lab-ai-authority','Where do governed evidence, controls, owners, and release authority sit?'),item('lab-observability','Which assurance, drift, incident, or control signals require action?','b'),item('lab-maintenance-swimlane','How do review, restriction, rollback, and corrective action cross accountable roles?','c')),
  general:plan(item('lab-work-package','Which actors, evidence, systems, and gates define the operating model?'),item('lab-reliability','Which evidence and uncertainty distinctions drive the engineering conclusion?','b'),item('lab-observability','Where can the operating model fail, and who owns recovery?','c'))
};

function premiumStory(profile:VisualProfile,text:string):VisualPlan{
  if(/knowledge graph/.test(text))return plan(item('lab-defect-lifecycle','Which governed entities and effective-dated relationships connect the article’s evidence?'),item('lab-work-package','Which identity, provenance, and acceptance controls qualify each relationship?','b'),item('lab-observability','Which missing, inferred, or stale relationship can invalidate the conclusion?','c'),item('lab-ai-authority','When must an inferred relationship be reviewed, withheld, or corrected?'));
  if(/health message normalization|normalizing aircraft health|canonical event/.test(text))return plan(item('lab-telemetry-architecture','How do source health messages become governed canonical events without erasing OEM or fleet meaning?'),item('lab-work-package','Which identity, schema, effectivity, and provenance fields form the normalization contract?','b'),item('lab-observability','Which mapping ambiguity or context failure requires quarantine rather than coercion?','c'),item('lab-ai-authority','When can a normalized event support analysis, and when must engineering review the source evidence?'));
  if(/maintenance intelligence operating system/.test(text))return plan(item('lab-telemetry-architecture','Where do evidence, context, analytical services, workflow, authority, and learning sit in the operating system?'),item('lab-work-package','Which contracts and state transitions make the system operable and auditable?','b'),item('lab-observability','Which evidence, service, or workflow failure should change the operating response?','c'));
  if(profile==='cloud-platform'){
    if(/observability|monitor|slo|latency/.test(text))return plan(item('lab-observability','Where is the decision path unhealthy, and which failed event should an operator inspect?'),item('lab-telemetry-sequence','Which telemetry, persistence, failure, and retry paths must remain traceable?','b'),item('lab-maintenance-swimlane','How do detection, diagnosis, recovery, and accountable review cross teams?','c'));
    if(/serverless|api|integration/.test(text))return plan(item('aws-architecture','Which airline, AWS, interface, and authority boundaries define the integration?'),item('lab-work-package','Which contract, release, and reconciliation gates control change?','b'),item('lab-observability','Which dependency, delivery, or state failure requires recovery?','c'));
    if(/connectivity|custody/.test(text))return plan(item('lab-telemetry-architecture','How does evidence cross aircraft, connectivity, platform, and operational custody boundaries?'),item('lab-work-package','Which validation, acknowledgement, persistence, and custody states establish trusted evidence?','b'),item('lab-observability','Where can loss, delay, duplication, or identity failure occur?','c'));
    if(/telemetry|event|stream|message/.test(text))return plan(item('lab-telemetry-architecture','How does evidence cross aircraft, transport, cloud, and operational boundaries?'),item('lab-telemetry-sequence','What happens on success, validation failure, retry, and replay?','b'),item('lab-observability','Which broken contract, delayed event, or failed consumer changes the operational response?','c'));
    if(/migration|modernization|api|integration/.test(text))return plan(item('aws-architecture','Which legacy, AWS, migration, and operational boundaries define the workload?'),item('lab-work-package','Which migration states and evidence gates control release?','b'),item('lab-observability','How is parity, cutover, rollback, and reconciliation observed?','c'));
  }
  if(profile==='aircraft-system'){
    if(/image|inspection|corrosion|vision/.test(text))return plan(item('lab-aircraft-system','Where is the inspection target and which installed context governs interpretation?'),item('lab-ai-authority','How do capture, inference, measurement, and inspector authority remain separate?','b'),item('lab-observability','Which capture or evidence failure requires recapture or abstention?','c'));
    if(/apu|engine indication|engine trend|engine monitoring/.test(text))return plan(item('lab-aircraft-system','Which installed functions, operating states, and evidence establish propulsion-system condition?'),item('lab-reliability','Which trends, exposure, and findings support engineering review?','b'),item('lab-observability','Which signal quality or configuration failure invalidates the trend?','c'));
    if(/electrical|fire protection|fuel system/.test(text))return plan(item('lab-aircraft-system','Which physical functions and protection boundaries govern the system?'),item('lab-defect-lifecycle','How does an indication progress through isolation, action, and confirmed outcome?','b'),item('lab-maintenance-swimlane','Which approved-data and authority handoffs govern action?','c'));
    if(/fault|troubleshoot|message|isolation/.test(text))return plan(item('lab-aircraft-system','How do physical functions, signals, and fault effects propagate?'),item('lab-defect-lifecycle','How does observed evidence become a governed troubleshooting case?','b'),item('lab-observability','Which missing signal or configuration context invalidates isolation?','c'));
    if(/health|condition|predictive|trend/.test(text))return plan(item('lab-aircraft-system','Which installed functions and evidence establish aircraft-system condition?'),item('lab-reliability','Which exposure and causal evidence establish an engineering concern?','b'),item('lab-defect-lifecycle','How does the condition progress from observation to confirmed outcome?','c'));
    if(/event|history|signal|monitor/.test(text))return plan(item('lab-aircraft-system','Which physical functions and installed boundaries govern the signal?'),item('lab-telemetry-sequence','How do observation, aircraft state, and maintenance evidence align in time?','b'),item('lab-observability','Which signal, timing, or configuration failure invalidates interpretation?','c'));
    if(/reliability|oil|hydraulic|landing gear|electrical|fire protection/.test(text))return plan(item('lab-aircraft-system','Which physical functions and failure effects govern the reliability question?'),item('lab-reliability','Which causes, exposure, and evidence establish the concern?','b'),item('lab-defect-lifecycle','How does observed evidence progress to confirmed finding and outcome?','c'));
  }
  if(profile==='technical-records'){
    if(/lineage|identity|configuration|trace/.test(text))return plan(item('lab-work-package','Which source identities, revisions, effectivity rules, and approvals establish record status?'),item('lab-telemetry-sequence','How do capture, transformation, correction, and acceptance preserve lineage?','b'),item('lab-observability','Where can synchronization, provenance, or signature fail?','c'));
    if(/authority|logbook/.test(text))return plan(item('lab-work-package','Which evidence, revision, signature, and acceptance states establish record authority?'),item('lab-maintenance-swimlane','Which accountable roles create, challenge, correct, and accept the record?','b'),item('lab-observability','Where can effectivity, signature, synchronization, or custody fail?','c'));
    if(/workflow|instruction|review|signature/.test(text))return plan(item('lab-maintenance-swimlane','Which roles create, review, correct, sign, and accept the record?'),item('lab-work-package','Which controlled states establish completion?','b'),item('lab-observability','Which evidence gap prevents record acceptance?','c'));
    if(/nlp|publication|completeness|electronic record/.test(text))return plan(item('lab-work-package','Which source, revision, applicability, and acceptance states establish the digital record?'),item('lab-ai-authority','Where must extraction or classification remain subordinate to reviewed record evidence?','b'),item('lab-observability','Which completeness, effectivity, or synchronization failure prevents reliance?','c'));
  }
  if(profile==='reliability-analysis'){
    if(/repeat|chronic|defect|recurrence|no.fault/.test(text))return plan(item('lab-defect-lifecycle','How does recurrence become a governed reliability case?'),item('lab-reliability','Which population, exposure, and causal evidence support the case?','b'),item('lab-observability','Where can identity, correlation, or outcome evidence break the analysis?','c'));
    if(/program|effectiveness|outcome|feedback/.test(text))return plan(item('lab-reliability','Which outcome evidence establishes program effectiveness?'),item('lab-maintenance-swimlane','How do reliability, engineering, operations, and records adjudicate a change?','b'),item('lab-observability','Which missing follow-up or biased population weakens the conclusion?','c'));
  }
  if(profile==='defect-investigation'){
    if(/no.fault|removal|shop/.test(text))return plan(item('lab-defect-lifecycle','How does symptom, removal, shop finding, and reinstallation evidence remain connected?'),item('lab-aircraft-system','Which installed context and test boundary qualify the finding?','b'),item('lab-maintenance-swimlane','Which roles adjudicate the evidence and record the disposition?','c'));
    if(/alert|correlation|fault isolation/.test(text))return plan(item('lab-defect-lifecycle','How do related observations become a candidate defect case?'),item('lab-observability','Which identity, timing, or context gap can create false correlation?','b'),item('lab-reliability','Which recurrence and exposure evidence warrants engineering review?','c'));
    if(/program|feedback|effectiveness/.test(text))return plan(item('lab-reliability','Which confirmed outcomes establish program effectiveness?'),item('lab-defect-lifecycle','How does a case return governed evidence to the program?','b'),item('lab-maintenance-swimlane','Which roles review and release a program change?','c'));
  }
  if(profile==='ai-assurance'||profile==='governance'){
    if(/evaluation|model|drift|classification|predictive/.test(text))return plan(item('lab-ai-authority','Where do inference, evaluation, safeguards, and human authority remain separate?'),item('lab-reliability','Which validation population, errors, and uncertainty bound use?','b'),item('lab-observability','Which drift, incident, or control evidence requires restriction?','c'));
  }
  if(profile==='general'){
    if(/resilien|readiness|continuity|recovery/.test(text))return plan(item('lab-telemetry-architecture','Which systems, dependencies, degraded modes, and recovery boundaries define resilience?'),item('lab-maintenance-swimlane','Which readiness evidence, role handoffs, and release gates control recovery?','b'),item('lab-observability','Where can the operating model fail, and who owns restoration?','c'));
    if(/api|integration|event processing|data etl/.test(text))return plan(item('lab-telemetry-architecture','Which source, integration, state, and consumer boundaries define the platform?'),item('lab-work-package','Which contract, validation, release, and reconciliation gates control the interface?','b'),item('lab-observability','Which interface or evidence failure requires recovery?','c'));
    if(/master data|data quality|data silo|ata data/.test(text))return plan(item('lab-work-package','Which source ownership, semantic, quality, and release states establish trusted shared data?'),item('lab-telemetry-sequence','How do validation, publication, correction, and replay change trusted state?','b'),item('lab-observability','Where can lineage, freshness, semantics, or delivery fail?','c'));
    if(/data platform|data product/.test(text))return plan(item('lab-telemetry-architecture','How do governed sources become reusable data products without losing meaning?'),item('lab-work-package','Which ownership, quality, interface, and release gates establish product status?','b'),item('lab-observability','Where can lineage, freshness, semantics, or delivery fail?','c'));
    if(/work order|planning|parked aircraft/.test(text))return plan(item('lab-work-package','Which controlled states and dependencies govern the operating plan?'),item('lab-defect-lifecycle','How do release, execution, exception, rework, and closure change plan state?','b'),item('lab-observability','Which dependency or state failure blocks progression?','c'));
    if(/expert system|explainability/.test(text))return plan(item('lab-ai-authority','How can analytical assistance remain explainable and subordinate to accountable authority?'),item('lab-reliability','Which evidence and uncertainty establish confidence?','b'),item('lab-observability','Which unsupported inference requires abstention?','c'));
    if(/digital twin/.test(text))return plan(item('lab-aircraft-system','Which physical asset, configuration, and evidence does the digital representation describe?'),item('lab-telemetry-architecture','How do observations update governed state without replacing authoritative records?','b'),item('lab-observability','Which synchronization or model failure invalidates the representation?','c'));
    if(/etl|lineage/.test(text))return plan(item('lab-work-package','Which source, transformation, quality, and release states govern the pipeline?'),item('lab-telemetry-sequence','Which ingestion, validation, correction, and replay states preserve evidence?','b'),item('lab-observability','Where can provenance or semantic integrity fail?','c'));
    if(/workforce|human|collaboration|remote/.test(text))return plan(item('lab-maintenance-swimlane','How do people, evidence, systems, and authority coordinate this work?'),item('lab-work-package','Which handoffs and controlled states preserve accountability?','b'),item('lab-observability','Where does workload, context, or communication fail?','c'));
    if(/program|effectiveness|feedback|learning/.test(text))return plan(item('lab-defect-lifecycle','How does operational evidence become a governed improvement cycle?'),item('lab-reliability','Which outcomes distinguish improvement from coincidence?','b'),item('lab-maintenance-swimlane','Which roles adjudicate and release the resulting change?','c'));
  }
  return premiumPlans[profile];
}

// Alternate stories stay inside a topic's valid visual vocabulary. They prevent a
// category template from becoming the illustration for every article in it.
const storyPools:Partial<Record<VisualProfile,VisualPlan[]>>={
  general:[plans.general,plan(item('topology','Which actors, systems, and handoffs define the operating model?'),item('table','Which evidence, ownership, and control distinctions matter?')),plan(item('knowledge-graph','Which governed entities and relationships carry the argument?'),item('infographic','What conceptual distinctions should the reader retain?')),plan(item('service-blueprint','How do people, interfaces, services, and records coordinate the work?'),item('table','Which responsibilities and controls must be explicit?')),plan(item('timeline','Which events, gates, and feedback establish the technical sequence?'),item('infographic','What are the essential stages and boundaries?')),plan(item('architecture','Where do evidence, services, controls, and accountable action sit?'),item('table','Which interfaces and controls require engineering ownership?'))],
  'aircraft-system':[plans['aircraft-system'],plan(item('aircraft','Which physical functions and configuration boundaries govern the observed condition?'),item('lab-reliability','Which causes, exposure, and evidence establish the engineering concern?'),item('table','Which signal, configuration, and maintenance controls must be verified?')),plan(item('topology','How do commands, energy, responses, and fault effects propagate?'),item('aircraft','Where is the function installed and how does effectivity change interpretation?'),item('timeline','Which evidence gates precede maintenance action?')),plan(item('aircraft','Which aircraft functions and installed boundaries govern troubleshooting?'),item('decision-tree','Which evidence permits continued isolation, inspection, or escalation?'),item('table','Which approved data and observed evidence constrain the decision?'))],
  'technical-records':[plans['technical-records'],plan(item('knowledge-graph','Which governed identities connect the technical record?'),item('timeline','Which creation, revision, review, signature, and correction events establish status?'),item('table','Which provenance and authority controls apply?')),plan(item('service-blueprint','How is evidence created, reviewed, corrected, signed, and accepted?'),item('knowledge-graph','Which document, task, component, and signature relationships must remain traceable?')),plan(item('table','Which record classes require provenance, revision, signature, and retention controls?'),item('timeline','When can a record advance, reopen, or become superseded?'))],
  'ai-assurance':[plans['ai-assurance'],plan(item('lab-ai-authority','Where must probabilistic assistance stop and accountable authority begin?'),item('table','Which model claims, tests, limits, and owners must remain traceable?'),item('decision-tree','Which evidence permits use, abstention, rollback, or escalation?')),plan(item('architecture','Where do model inference, tool access, safeguards, and human review sit?'),item('service-blueprint','How do evaluation, release, monitoring, and incident response operate together?')),plan(item('infographic','Which outputs are evidence, inference, synthesis, or unsupported claims?'),item('table','Which controls bind each output class?'),item('decision-tree','When must the system abstain or escalate?'))],
  'reliability-analysis':[plans['reliability-analysis'],plan(item('lab-reliability','Which causes dominate and is the exposure-normalized rate changing?'),item('knowledge-graph','Which aircraft, configuration, component, action, and outcome relationships define the population?')),plan(item('timeline','How do events, maintenance actions, modification state, and outcomes relate over time?'),item('table','Which exposure, effectivity, finding, and outcome fields are required?')),plan(item('topology','Which evidence sources and governed joins create the reliability population?'),item('lab-reliability','Is the evidence sufficient for engineering action?'))],
  'maintenance-control':[plans['maintenance-control'],plan(item('lab-maintenance-swimlane','Where do work, evidence, and authority move during control?'),item('table','Which evidence and disposition controls govern the handoff?')),plan(item('lab-ai-authority','How can assistance remain inspectable without acquiring authority?'),item('infographic','Which outputs are facts, signals, synthesis, or unsupported claims?'))],
  'defect-investigation':[plans['defect-investigation'],plan(item('lab-defect-lifecycle','How does recurrence become a governed case and return to monitoring?'),item('timeline','Which discrepancy, action, recurrence, and verification events belong together?')),plan(item('knowledge-graph','Which symptoms, positions, components, tasks, and findings form the candidate case?'),item('table','Which evidence confirms or separates recurrence?'))],
  'knowledge-assistance':[plans['knowledge-assistance'],plan(item('knowledge-graph','Which sources and applicability rules support each material claim?'),item('table','Which retrieval, citation, synthesis, and review controls apply?')),plan(item('service-blueprint','How do retrieval, citation, synthesis, review, and correction work together?'),item('infographic','Which output classes must be visually distinct?'),item('decision-tree','When should the assistant answer, request context, or abstain?'))],
  'outcome-learning':[plans['outcome-learning'],plan(item('timeline','Which decision, action, observation, and adjudication events close the loop?'),item('knowledge-graph','Which relationships turn an outcome into governed learning?')),plan(item('service-blueprint','How do operations, reliability, engineering, and data products consume outcomes?'),item('table','Which linkage, adjudication, ownership, and effectiveness controls are required?'))]
};

function contextText(context:PublicationVisualContext){return `${context.title} ${context.domain} ${context.tags.join(' ')}`.toLowerCase()}
export function visualProfile(context:PublicationVisualContext):VisualProfile{
  const text=contextText(context);
  if(/decision brief|chatbot|retrieval|knowledge|copilot/.test(text))return'knowledge-assistance';
  if(/cloud|serverless|aws|event-driven|event stream|telemetry|edge analytics|api modernization|system integration|observability|migration/.test(text))return'cloud-platform';
  if(context.ata.length||/apu|landing gear|flight control|electrical power|pneumatic|fuel system|fire protection|aircraft system/.test(text))return'aircraft-system';
  if(/rotable|component history|part trace|parts trace|custody|serialized part|repair vendor/.test(text))return'component-lifecycle';
  if(/parts demand|material planning|inventory|supply chain|aog|stock|spares|repair cycle/.test(text))return'material-planning';
  if(/technical record|electronic record|document|lineage|configuration|logbook|record completeness/.test(text))return'technical-records';
  if(/task card|work package|work instruction|hangar work|maintenance execution|digital task/.test(text))return'work-execution';
  if(/maintenance control|dispatch|queue|operational disruption|remote engineering/.test(text))return'maintenance-control';
  if(/repeat defect|chronic defect|no.fault.found|fault isolation|alert correlation|recurrence/.test(text))return'defect-investigation';
  if(/outcome learning|maintenance outcome|feedback loop|closing the loop|program feedback/.test(text))return'outcome-learning';
  if(/computer vision|multimodal|image|visual inspection|remote inspection|corrosion screening|vision-assisted/.test(text))return'inspection-ai';
  if(/nlp|generative ai|assistant/.test(text))return'knowledge-assistance';
  if(/\bai\b|machine learning|\bml\b|agent|model assurance|predictive model|fault classification/.test(text))return /governance|assurance|safety case/.test(text)?'governance':'ai-assurance';
  if(/reliability|defect|failure|predictive|condition|health|trend|removal|program effectiveness/.test(text))return'reliability-analysis';
  if(/security|cyber|risk|governance|assurance|authority/.test(text))return'governance';
  return'general';
}
function articleVariant(_slug:string,role:VisualRole):VisualVariant{return ({hero:'a',evidence:'b',analysis:'c',decision:'a'} as const)[role]}
function contentStory(profile:VisualProfile,text:string){
  const pool=storyPools[profile];if(!pool?.length)return plans[profile];
  // Select an information model from the article's engineering concern. This is
  // deliberately explicit: publication visuals must never vary because a slug,
  // date, or hash happened to produce a different number.
  if(profile==='technical-records'){
    if(/workflow|work instruction|remote review/.test(text))return pool[Math.min(2,pool.length-1)];
    if(/completeness|logbook|publication|nlp/.test(text))return pool[Math.min(3,pool.length-1)];
    if(/lineage|etl|data/.test(text))return pool[Math.min(1,pool.length-1)];
  }
  if(profile==='general'){
    if(/feedback|program|effectiveness/.test(text))return pool[Math.min(4,pool.length-1)];
    if(/fault|context|relationship/.test(text))return pool[Math.min(2,pool.length-1)];
    if(/resilien|readiness|degraded/.test(text))return pool[Math.min(1,pool.length-1)];
    if(/platform|operating system|architecture/.test(text))return pool[Math.min(5,pool.length-1)];
  }
  if(/authority|abstain|human review|qualified/.test(text))return pool[Math.min(2,pool.length-1)];
  if(/failure|exception|retry|replay|recovery|incident|defect|fault/.test(text))return pool[Math.min(3,pool.length-1)];
  if(/identity|effectivity|lineage|provenance|trace|record|document/.test(text))return pool[Math.min(1,pool.length-1)];
  if(/architecture|platform|cloud|integration|network|system of systems/.test(text))return pool[Math.min(5,pool.length-1)];
  if(/workflow|work package|service|handover|operations|execution/.test(text))return pool[Math.min(3,pool.length-1)];
  if(/lifecycle|sequence|timeline|program|change|evolution/.test(text))return pool[Math.min(4,pool.length-1)];
  if(/data|evidence|knowledge|relationship|configuration/.test(text))return pool[Math.min(2,pool.length-1)];
  if(/decision|control|governance|assurance|risk/.test(text))return pool[Math.min(1,pool.length-1)];
  return pool[0];
}
export function visualSelection(context:PublicationVisualContext,role:VisualRole){
  const profile=visualProfile(context);const text=contextText(context);const isPremiumTier=context.issueDate>='2017-01-01';let selection=(isPremiumTier?premiumStory(profile,text):context.slug==='2026-06-ai-assisted-maintenance-control'?plans['maintenance-control']:context.slug==='2026-01-maintenance-decision-brief'?plans['knowledge-assistance']:contentStory(profile,text))[role];
  if(!isPremiumTier&&profile==='cloud-platform'&&/observability/.test(text))selection=role==='hero'?item('lab-observability','Where is the decision path unhealthy, and which failed event should an operator inspect first?'):role==='evidence'?item('lab-telemetry-sequence','Which success, persistence, validation, and retry paths must remain traceable?'):role==='analysis'?item('table','Which SLO, failure, recovery, and evidence controls require ownership?'):undefined;
  else if(!isPremiumTier&&profile==='cloud-platform'&&/telemetry|event-driven|event stream/.test(text))selection=role==='hero'?item('lab-telemetry-architecture','How does aircraft evidence cross aircraft, transport, cloud, and operational boundaries?'):role==='evidence'?item('lab-telemetry-sequence','What happens to an event on success, validation failure, persistence, and retry?'):role==='analysis'?item('table','Which custody, schema, replay, and consumer controls must be observable?'):undefined;
  if(profile==='aircraft-system'&&context.ata.some(value=>value==='49'||value.startsWith('49')))selection=role==='hero'?item('lab-aircraft-system','How do APU components, control signals, aircraft messages, and maintenance interpretation relate?'):selection;
  return selection?{...selection,variant:articleVariant(context.slug,role),profile}:null
}
export function publicationMode(context:Pick<PublicationVisualContext,'slug'|'issueDate'>):PublicationMode{const year=Number(context.issueDate.slice(0,4));const month=Number(context.issueDate.slice(5,7));return modes[(year+month)%modes.length]}
export const visualFamilies=[...new Set(Object.values(plans).flatMap(p=>Object.values(p).filter(Boolean).map(i=>i!.family)))];
