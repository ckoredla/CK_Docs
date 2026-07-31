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
function articleVariant(slug:string,role:VisualRole):VisualVariant{const seed=[...`${slug}:${role}`].reduce((sum,char)=>sum+char.charCodeAt(0),0);return(['a','b','c'] as const)[seed%3]}
export function visualSelection(context:PublicationVisualContext,role:VisualRole){
  const profile=visualProfile(context);const text=contextText(context);const pool=storyPools[profile];const storySeed=[...context.slug].reduce((sum,char)=>sum+char.charCodeAt(0),0);let selection=(context.slug==='2026-06-ai-assisted-maintenance-control'?plans['maintenance-control']:context.slug==='2026-01-maintenance-decision-brief'?plans['knowledge-assistance']:pool?pool[storySeed%pool.length]:plans[profile])[role];
  if(profile==='cloud-platform'&&/observability/.test(text))selection=role==='hero'?item('lab-observability','Where is the decision path unhealthy, and which failed event should an operator inspect first?'):role==='evidence'?item('lab-telemetry-sequence','Which success, persistence, validation, and retry paths must remain traceable?'):role==='analysis'?item('table','Which SLO, failure, recovery, and evidence controls require ownership?'):undefined;
  else if(profile==='cloud-platform'&&/telemetry|event-driven|event stream/.test(text))selection=role==='hero'?item('lab-telemetry-architecture','How does aircraft evidence cross aircraft, transport, cloud, and operational boundaries?'):role==='evidence'?item('lab-telemetry-sequence','What happens to an event on success, validation failure, persistence, and retry?'):role==='analysis'?item('table','Which custody, schema, replay, and consumer controls must be observable?'):undefined;
  if(profile==='aircraft-system'&&context.ata.some(value=>value==='49'||value.startsWith('49')))selection=role==='hero'?item('lab-aircraft-system','How do APU components, control signals, aircraft messages, and maintenance interpretation relate?'):selection;
  return selection?{...selection,variant:articleVariant(context.slug,role),profile}:null
}
export function publicationMode(context:Pick<PublicationVisualContext,'slug'|'issueDate'>):PublicationMode{const year=Number(context.issueDate.slice(0,4));const month=Number(context.issueDate.slice(5,7));return modes[(year+month)%modes.length]}
export const visualFamilies=[...new Set(Object.values(plans).flatMap(p=>Object.values(p).filter(Boolean).map(i=>i!.family)))];
