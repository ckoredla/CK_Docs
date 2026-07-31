import type { PublicationMode, PublicationVisualContext, VisualRole, VisualVariant } from './types';

export type VisualFamily='aws-architecture'|'architecture'|'topology'|'dashboard'|'timeline'|'decision-tree'|'heatmap'|'service-blueprint'|'journey-map'|'knowledge-graph'|'aircraft'|'metrics'|'infographic'|'risk'|'table';
export type VisualProfile='cloud-platform'|'aircraft-system'|'component-lifecycle'|'material-planning'|'technical-records'|'work-execution'|'maintenance-control'|'defect-investigation'|'reliability-analysis'|'outcome-learning'|'inspection-ai'|'knowledge-assistance'|'ai-assurance'|'governance'|'general';
type RolePlan={family:VisualFamily;variant:VisualVariant;question:string};
type VisualPlan=Partial<Record<VisualRole,RolePlan>>;

const modes:PublicationMode[]=['research','briefing','handbook','field-guide','technical-manual','playbook','decision-record','case-study'];
const plan=(hero:RolePlan,evidence?:RolePlan,analysis?:RolePlan,decision?:RolePlan):VisualPlan=>({hero,evidence,analysis,decision});
const item=(family:VisualFamily,question:string,variant:VisualVariant='a'):RolePlan=>({family,question,variant});

const plans:Record<VisualProfile,VisualPlan>={
  'cloud-platform':plan(
    item('aws-architecture','Which AWS, airline, and MRO boundaries carry this workload from intake to an authoritative update?'),
    item('topology','Where does evidence change custody, connectivity, or persistence?','b'),
    item('dashboard','Which operating signals reveal delay, failure, recovery, and evidence health?')
  ),
  'aircraft-system':plan(
    item('aircraft','Which aircraft functions, signal paths, and configuration boundaries govern this system?'),
    item('topology','How do energy, commands, responses, and fault effects propagate?','b'),
    item('metrics','How does observed behavior compare across regime, exposure, and configuration?'),
    item('timeline','Which evidence and review gates must be satisfied before maintenance action?')
  ),
  'component-lifecycle':plan(
    item('topology','How do component identity, condition, custody, and installed position move through the network?'),
    item('timeline','Which installation, removal, repair, modification, and release events establish technical status?'),
    item('knowledge-graph','Which aircraft, position, component, document, shop finding, and custody relationships must remain traceable?')
  ),
  'material-planning':plan(
    item('topology','How do demand, stock, repair, pooling, substitution, and station supply interact?'),
    item('metrics','What distribution and uncertainty describe demand or repair-cycle exposure?'),
    item('risk','Which material decisions create AOG, excess-stock, or traceability consequence?')
  ),
  'technical-records':plan(
    item('knowledge-graph','Which governed identities and relationships connect the technical record?'),
    item('service-blueprint','How is evidence created, reviewed, corrected, signed, and accepted into the aircraft record?'),
    item('table','Which information classes require provenance, revision, signature, and authority controls?')
  ),
  'work-execution':plan(
    item('service-blueprint','How do technicians, inspectors, interfaces, services, and records coordinate execution?'),
    item('timeline','Which task states, findings, inspections, and recovery gates control progression?'),
    item('decision-tree','Which conditions release work, open rework, require inspection, or prevent closure?')
  ),
  'maintenance-control':plan(
    item('architecture','Where do governed evidence, AI assistance, safeguards, and qualified maintenance authority sit?'),
    item('service-blueprint','How do maintenance control, engineering, stations, materials, and records coordinate the decision?'),
    item('infographic','Which evidence classes should the decision brief preserve, qualify, cite, or reject?'),
    item('decision-tree','Which conditions lead to action, more evidence, engineering escalation, or abstention?')
  ),
  'defect-investigation':plan(
    item('timeline','How do the initial discrepancy, corrective action, recurrence, finding, and verification form one case?'),
    item('knowledge-graph','Which symptoms, positions, components, tasks, and findings belong to the candidate defect case?'),
    item('heatmap','Where does recurrence concentrate by tail, position, configuration, station, or action?')
  ),
  'reliability-analysis':plan(
    item('metrics','What exposure-normalized distribution or trend establishes the reliability concern?'),
    item('timeline','How do events, maintenance actions, modification state, and confirmed outcomes relate over time?'),
    item('heatmap','Where is the concern concentrated by fleet, configuration, position, or operating cohort?')
  ),
  'outcome-learning':plan(
    item('service-blueprint','How does a maintenance decision become a confirmed outcome and a governed learning signal?'),
    item('timeline','Which operational, engineering, and program cadences consume the outcome?'),
    item('dashboard','Which measures reveal missing linkage, delayed adjudication, and ineffective feedback?')
  ),
  'inspection-ai':plan(
    item('aircraft','Where is the inspection target, and which effectivity, access, and physical scale govern interpretation?'),
    item('journey-map','How do capture quality, localization, model review, measurement, and inspector authority interact?'),
    item('metrics','How does performance vary by lighting, angle, surface, equipment, and finding class?'),
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
    item('risk','Which model or agent failures change operational consequence or required control?'),
    item('decision-tree','Which evidence permits recommendation, restricted use, abstention, rollback, or escalation?')
  ),
  governance:plan(
    item('risk','Which hazards, threats, and uncertainties determine control intensity?'),
    item('table','Which requirement, evidence, owner, control, and review status must remain traceable?'),
    item('heatmap','Where are assurance or control gaps concentrated across the operating envelope?'),
    item('decision-tree','Which evidence permits release, restriction, rollback, or withdrawal?')
  ),
  general:plan(
    item('infographic','What is the essential engineering model the reader must retain?'),
    item('table','Which evidence classes, owners, and controls must be compared directly?')
  )
};

function contextText(context:PublicationVisualContext){return `${context.title} ${context.domain} ${context.tags.join(' ')}`.toLowerCase()}
export function visualProfile(context:PublicationVisualContext):VisualProfile{
  const text=contextText(context);
  if(/cloud|serverless|aws|event-driven|event stream|telemetry|edge analytics|api modernization|system integration|observability|migration/.test(text))return'cloud-platform';
  if(context.ata.length||/apu|landing gear|flight control|electrical power|pneumatic|fuel system|fire protection|aircraft system/.test(text))return'aircraft-system';
  if(/rotable|component history|part trace|parts trace|custody|serialized part|repair vendor/.test(text))return'component-lifecycle';
  if(/parts demand|material planning|inventory|supply chain|aog|stock|spares|repair cycle/.test(text))return'material-planning';
  if(/technical record|electronic record|document|lineage|configuration|logbook|record completeness/.test(text))return'technical-records';
  if(/task card|work package|work instruction|hangar work|maintenance execution|digital task/.test(text))return'work-execution';
  if(/maintenance control|dispatch|decision brief|queue|operational disruption|remote engineering/.test(text))return'maintenance-control';
  if(/repeat defect|chronic defect|no.fault.found|fault isolation|alert correlation|recurrence/.test(text))return'defect-investigation';
  if(/outcome learning|maintenance outcome|feedback loop|closing the loop|program feedback/.test(text))return'outcome-learning';
  if(/computer vision|multimodal|image|visual inspection|remote inspection|corrosion screening|vision-assisted/.test(text))return'inspection-ai';
  if(/copilot|retrieval|knowledge|nlp|generative ai|assistant|decision brief/.test(text))return'knowledge-assistance';
  if(/\bai\b|machine learning|\bml\b|agent|model assurance|predictive model|fault classification/.test(text))return /governance|assurance|safety case/.test(text)?'governance':'ai-assurance';
  if(/reliability|defect|failure|predictive|condition|health|trend|removal|program effectiveness/.test(text))return'reliability-analysis';
  if(/security|cyber|risk|governance|assurance|authority/.test(text))return'governance';
  return'general';
}
export function visualSelection(context:PublicationVisualContext,role:VisualRole){const profile=visualProfile(context);const selection=plans[profile][role];return selection?{...selection,profile}:null}
export function publicationMode(context:Pick<PublicationVisualContext,'slug'|'issueDate'>):PublicationMode{const year=Number(context.issueDate.slice(0,4));const month=Number(context.issueDate.slice(5,7));return modes[(year+month)%modes.length]}
export const visualFamilies=[...new Set(Object.values(plans).flatMap(p=>Object.values(p).filter(Boolean).map(i=>i!.family)))];
