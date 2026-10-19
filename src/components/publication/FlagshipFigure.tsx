import type { PublicationVisualContext, VisualRole } from './types';

/** Publication-grade, concept-specific diagrams. No fabricated operational metrics.
 * Each visual answers a distinct technical question. SVG is accessible and scalable. */
type Props={context:PublicationVisualContext;role:VisualRole};
type Node={x:number;y:number;label:string;detail?:string;kind?:'record'|'human'|'event'|'gate'|'cloud'};
const titleMap:Record<string,string>={
'2026-11-maintenance-outcome-learning':'Learning from maintenance outcomes',
'2026-09-digital-work-package-orchestration':'Orchestrating a digital work package',
'2026-08-maintenance-event-ledger':'Building a trustworthy maintenance event ledger'
};
export const flagshipSlugs=new Set(Object.keys(titleMap));
const data:Record<string,{
  hero:Node[]; heroEdges:[number,number,string?][]; evidence:Node[]; evidenceEdges:[number,number,string?][];analysis:Node[];analysisEdges:[number,number,string?][];decision:Node[];decisionEdges:[number,number,string?][];
  labels:Record<VisualRole,string>; notes:Record<VisualRole,string>;
}>={
'2026-11-maintenance-outcome-learning':{
 hero:[
  {x:95,y:100,label:'SIGNAL',detail:'Observed condition',kind:'event'},
  {x:325,y:100,label:'REVIEW',detail:'Decision rationale',kind:'human'},
  {x:555,y:100,label:'ACTION',detail:'Approved maintenance',kind:'human'},
  {x:555,y:290,label:'OBSERVE',detail:'Subsequent operation',kind:'event'},
  {x:325,y:290,label:'ADJUDICATE',detail:'Qualified outcome review',kind:'gate'},
  {x:95,y:290,label:'LEARN',detail:'Governed rule / model change',kind:'record'}],
 heroEdges:[[0,1,'context'],[1,2,'disposition'],[2,3,'follow-up window'],[3,4,'evidence'],[4,5,'confirmed only'],[5,0,'future signals']],
 evidence:[
 {x:85,y:130,label:'Alert ID',detail:'Condition + timestamp',kind:'event'},
 {x:270,y:130,label:'Work record',detail:'Task + component',kind:'record'},
 {x:460,y:130,label:'Shop findings',detail:'Verified findings',kind:'record'},
 {x:660,y:130,label:'Recurrence',detail:'Hours / cycles',kind:'event'}],
 evidenceEdges:[[0,1,'correlate'],[1,2,'trace'],[2,3,'observe']],
 analysis:[
 {x:110,y:110,label:'Outcome known?',kind:'gate'},
 {x:365,y:60,label:'INCONCLUSIVE',detail:'Pending observations',kind:'record'},
 {x:365,y:205,label:'REVIEWED',detail:'Effectiveness recorded',kind:'human'},
 {x:655,y:205,label:'ELIGIBLE',detail:'Controlled evaluation',kind:'record'}],
 analysisEdges:[[0,1,'no'],[0,2,'yes'],[2,3,'quality gate']],
 decision:[
 {x:95,y:130,label:'Operations',detail:'Timely feedback',kind:'human'},
 {x:325,y:130,label:'Reliability',detail:'Case adjudication',kind:'human'},
 {x:555,y:130,label:'Model council',detail:'Change evaluation',kind:'gate'}],
 decisionEdges:[[0,1,'review'],[1,2,'evidence only']] ,
 labels:{hero:'Outcome-learning feedback loop',evidence:'Evidence lineage across systems',analysis:'Unknown outcomes must stay unknown',decision:'Governed learning and release authority'},
 notes:{hero:'A recommendation is not ground truth. Learning is conditional on a reviewed outcome.',evidence:'Each join retains source, event time, effectivity and version. Missing links remain explicit.',analysis:'No-fault-found and component removal are not automatic confirmation of an alert.',decision:'Operational feedback, engineering adjudication and model release are separate responsibilities.'}
},
'2026-09-digital-work-package-orchestration':{
 hero:[
 {x:90,y:100,label:'SCOPE',detail:'Tasks + aircraft',kind:'record'},
 {x:275,y:100,label:'PLAN',detail:'Parts + skills',kind:'record'},
 {x:460,y:100,label:'READY?',detail:'Release gate',kind:'gate'},
 {x:650,y:100,label:'EXECUTE',detail:'Tasks + findings',kind:'human'},
 {x:650,y:295,label:'REVIEW',detail:'Independent inspection',kind:'human'},
 {x:365,y:295,label:'CLOSE',detail:'Signed aircraft record',kind:'record'}],
 heroEdges:[[0,1,'plan'],[1,2,'dependencies'],[2,3,'authorized'],[3,4,'work results'],[4,5,'sign-off'],[4,3,'rework']],
 evidence:[
 {x:95,y:125,label:'Applicability',detail:'Aircraft + revision',kind:'record'},
 {x:315,y:70,label:'Materials',detail:'Serviceable + allocated',kind:'record'},
 {x:315,y:220,label:'Skills',detail:'Qualified + available',kind:'human'},
 {x:585,y:125,label:'Release gate',detail:'All dependencies verified',kind:'gate'}],
 evidenceEdges:[[0,1,'needed'],[0,2,'needed'],[1,3,'stock check'],[2,3,'roster check']],
 analysis:[
 {x:115,y:130,label:'REVISION',detail:'Task changed',kind:'event'},
 {x:365,y:75,label:'CONFLICT',detail:'Replan affected steps',kind:'gate'},
 {x:365,y:245,label:'OFFLINE',detail:'Reconcile signed work',kind:'record'},
 {x:665,y:130,label:'RESUME',detail:'After authorized review',kind:'human'}],
 analysisEdges:[[0,1,'new effectivity'],[0,2,'sync delay'],[1,3,'revalidate'],[2,3,'reconcile']],
 decision:[
 {x:100,y:130,label:'Planner',detail:'Readiness ownership',kind:'human'},
 {x:330,y:130,label:'Technician',detail:'Execution + findings',kind:'human'},
 {x:570,y:130,label:'Inspector',detail:'Signed acceptance',kind:'gate'}],
 decisionEdges:[[0,1,'release'],[1,2,'inspection']],
 labels:{hero:'Work-package state machine',evidence:'Release depends on more than a task list',analysis:'Revision and offline exception handling',decision:'Execution, inspection and record authority'},
 notes:{hero:'Every state transition requires an accountable owner, evidence and permitted rollback.',evidence:'The readiness gate does not substitute for the approved maintenance program.',analysis:'Interruptions and changed revisions reopen affected obligations rather than silently carrying forward.',decision:'Orchestration coordinates tasks; qualified personnel and authoritative systems retain control.'}
},
'2026-08-maintenance-event-ledger':{
 hero:[
 {x:90,y:100,label:'MRO / AIRCRAFT',detail:'Authoritative source',kind:'record'},
 {x:290,y:100,label:'CONTRACT',detail:'Schema + effectivity',kind:'gate'},
 {x:490,y:100,label:'EVENT BUS',detail:'Versioned delivery',kind:'cloud'},
 {x:690,y:100,label:'CONSUMERS',detail:'Reliability + AI',kind:'cloud'},
 {x:490,y:285,label:'IMMUTABLE LOG',detail:'Original evidence',kind:'record'},
 {x:290,y:285,label:'QUARANTINE',detail:'Repair + reprocess',kind:'gate'}],
 heroEdges:[[0,1,'event ID'],[1,2,'valid'],[2,3,'subscribe'],[2,4,'archive'],[1,5,'invalid'],[5,1,'repair'],[4,2,'replay']],
 evidence:[
 {x:95,y:135,label:'Source envelope',detail:'Event + ingest time',kind:'event'},
 {x:315,y:135,label:'Canonical contract',detail:'Identity + schema version',kind:'record'},
 {x:555,y:135,label:'Projection',detail:'Consumer-owned state',kind:'cloud'}],
 evidenceEdges:[[0,1,'provenance'],[1,2,'idempotent consume']],
 analysis:[
 {x:100,y:130,label:'INVALID',detail:'Schema / effectivity',kind:'gate'},
 {x:350,y:65,label:'QUARANTINE',detail:'Preserve raw payload',kind:'record'},
 {x:350,y:230,label:'REPAIR',detail:'Versioned transformation',kind:'human'},
 {x:655,y:130,label:'REPLAY',detail:'Offset + audit',kind:'cloud'}],
 analysisEdges:[[0,1,'isolate'],[1,2,'review'],[2,3,'retry']],
 decision:[
 {x:95,y:130,label:'Source MRO',detail:'Owns maintenance truth',kind:'record'},
 {x:330,y:130,label:'Platform team',detail:'Delivery + lineage',kind:'cloud'},
 {x:570,y:130,label:'Engineering',detail:'Interprets evidence',kind:'human'}],
 decisionEdges:[[0,1,'publish'],[1,2,'reviewable data']],
 labels:{hero:'Reference architecture: ledger, replay and quarantine',evidence:'What a maintenance event contract carries',analysis:'A rejected event is not a deleted event',decision:'Ownership and maintenance authority boundaries'},
 notes:{hero:'Conceptual workload: event bus, immutable storage and consumers are logical roles, not a prescribed AWS deployment.',evidence:'Event time, ingestion time, event ID, source, effectivity and version remain independently inspectable.',analysis:'Invalid events go to quarantine; replay is auditable and idempotent.',decision:'Downstream analysis never becomes an authoritative maintenance transaction.'}
}
};
const ink='#19364b';const teal='#087f8c';const grey='#647c8d';
function offset(a:Node,b:Node){const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy)||1;return {x:a.x+dx/dist*50,y:a.y+dy/dist*40,X:b.x-dx/dist*50,Y:b.y-dy/dist*40}}
function Glyph({kind,x,y}:{kind:Node['kind'];x:number;y:number}){
 const common={stroke:ink,strokeWidth:2.4,fill:'none',strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 return <g transform={`translate(${x} ${y})`} aria-hidden="true">
 {kind==='human'?<><circle cx="0" cy="-8" r="6" {...common}/><path d="M-13 12 Q-12 -1 0 -1 Q12 -1 13 12" {...common}/></>:
 kind==='gate'?<><path d="M0 -16 L15 -1 L0 14 L-15 -1 Z" {...common}/><path d="M-7 -1 L-1 5 L8 -6" {...common}/></>:
 kind==='cloud'?<><path d="M-14 10 Q-24 7 -19 -5 Q-16 -12 -8 -11 Q-3 -22 8 -14 Q16 -11 16 -4 Q26 -2 19 10 Z" {...common}/><path d="M-8 4 H10 M2 -3 L10 4 L2 11" {...common}/></>:
 kind==='event'?<><path d="M-13 -14 H13 V14 H-13 Z M-7 -6 H7 M-7 1 H7 M-7 8 H1" {...common}/></>:
 <><path d="M-13 -14 H7 L13 -8 V14 H-13 Z M7 -14 V-8 H13 M-7 -1 H7 M-7 6 H7" {...common}/></>}
 </g>;
}
function Backdrop({slug,role}:{slug:string;role:VisualRole}){
 const isLedger=slug.includes('event-ledger'),isWork=slug.includes('work-package');
 return <g aria-hidden="true">
 <path d="M0 0 H780 V390 H0Z" fill="#f9fcfd"/>
 {isLedger?<><rect x="18" y="20" width="195" height="347" rx="12" fill="#e9f2f7"/><rect x="226" y="20" width="320" height="347" rx="12" fill="#f3f6fa"/><rect x="557" y="20" width="205" height="347" rx="12" fill="#edf5f1"/><text x="32" y="39" fontSize="11" fontWeight="750" fill="#4c6c7c">SOURCE SYSTEMS</text><text x="239" y="39" fontSize="11" fontWeight="750" fill="#4c6c7c">GOVERNED PLATFORM</text><text x="571" y="39" fontSize="11" fontWeight="750" fill="#4c6c7c">CONSUMERS / REVIEW</text></>:isWork?<><path d="M15 187 H765" stroke="#dce7ee" strokeDasharray="5 5"/><text x="25" y="25" fontSize="11" fontWeight="750" fill="#647c8d">PLANNING / CONTROL</text><text x="25" y="220" fontSize="11" fontWeight="750" fill="#647c8d">WORK EXECUTION / RECORD</text></>:<><path d="M25 192 H755" stroke="#dce7ee" strokeDasharray="6 6"/><text x="23" y="25" fontSize="11" fontWeight="750" fill="#647c8d">{role==='hero'?'OBSERVE → ACT':'EVIDENCE / REVIEW'}</text><text x="23" y="224" fontSize="11" fontWeight="750" fill="#647c8d">{role==='hero'?'VALIDATE → LEARN':'EXCEPTIONS / ASSURANCE'}</text></>}
 </g>;
}
export function FlagshipFigure({context,role}:Props){
 const spec=data[context.slug];if(!spec)return null;
 const nodes=spec[role];const edges=spec[(role+'Edges') as 'heroEdges'|'evidenceEdges'|'analysisEdges'|'decisionEdges'];
 const markerId='nbl-arr-'+context.slug.replace(/[^a-z0-9]/g,'')+'-'+role;
 return <figure className="nbl-flagship" data-visual-family={`flagship-${context.slug}-${role}`} data-visual-profile="editorial-curated" data-visual-question={spec.labels[role]}>
 <div className="nbl-flagship-heading"><span>Northbound Labs / Reference engineering</span><h3>{spec.labels[role]}</h3></div>
 <svg viewBox="0 0 780 390" role="img" aria-label={spec.labels[role]} xmlns="http://www.w3.org/2000/svg">
 <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1 L7 4 L1 7" stroke={teal} strokeWidth="1.7" fill="none"/></marker></defs>
 <Backdrop slug={context.slug} role={role}/>
 {edges.map(([i,j,label],idx)=>{const a=nodes[i],b=nodes[j],p=offset(a,b);const midX=(p.x+p.X)/2,midY=(p.y+p.Y)/2;const recur=(i===nodes.length-1&&j===0)||(label==='replay')||(label==='rework');const path=recur?`M${p.x} ${p.y} Q${midX} ${Math.min(p.y,p.Y)-110} ${p.X} ${p.Y}`:`M${p.x} ${p.y} L${p.X} ${p.Y}`;return <g key={idx}><path d={path} fill="none" stroke={teal} strokeWidth="2.5" strokeDasharray={recur?'7 5':undefined} markerEnd={`url(#${markerId})`}/>{label?<text x={midX} y={midY-12} fontSize="11" textAnchor="middle" fontWeight="650" fill="#526c79">{label}</text>:null}</g>})}
 {nodes.map((n,i)=><g key={i}><circle cx={n.x} cy={n.y} r="38" fill="#fff" stroke={n.kind==='gate'?'#bd9251':n.kind==='human'?'#3b9677':teal} strokeWidth="3"/><circle cx={n.x} cy={n.y} r="32" fill={n.kind==='gate'?'#fff6e6':n.kind==='human'?'#edf8f1':n.kind==='cloud'?'#edf9fc':'#f0f6fa'}/><Glyph kind={n.kind} x={n.x} y={n.y}/><text x={n.x} y={n.y+56} textAnchor="middle" fontSize="11" fontWeight="800" fill={ink}>{n.label}</text>{n.detail?<text x={n.x} y={n.y+71} textAnchor="middle" fontSize="10.5" fill={grey}>{n.detail}</text>:null}</g>)}
 </svg>
 <figcaption>{spec.notes[role]}</figcaption>
 </figure>
}
