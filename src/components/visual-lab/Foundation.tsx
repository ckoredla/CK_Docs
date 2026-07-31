import type { ReactNode } from 'react';

export function FigureFrame({id,title,question,type,rationale,notes,disclaimer,children}:{id:string;title:string;question:string;type:string;rationale:string;notes:string;disclaimer?:string;children:ReactNode}){return <article className="lab-entry"><header className="lab-entry-header"><span>{id}</span><div><p>{type}</p><h2>{title}</h2><dl><div><dt>Technical question</dt><dd>{question}</dd></div><div><dt>Design rationale</dt><dd>{rationale}</dd></div><div><dt>Responsive notes</dt><dd>{notes}</dd></div></dl></div></header><figure id={`figure-${id}`} className="lab-figure" aria-labelledby={`title-${id}`} aria-describedby={`caption-${id}`}><h3 id={`title-${id}`} className="lab-figure-title">{title}</h3>{children}<figcaption id={`caption-${id}`}>{question}{disclaimer?<strong>{disclaimer}</strong>:null}</figcaption></figure></article>}
export const FigureHeader=({eyebrow,title}:{eyebrow:string;title:string})=><header className="figure-heading"><span>{eyebrow}</span><b>{title}</b></header>;
export const FigureCaption=({children}:{children:ReactNode})=><div className="figure-caption">{children}</div>;
export const FigureLegend=({items}:{items:[string,string][]})=><div className="figure-legend" aria-label="Legend">{items.map(([tone,label])=><span key={label}><i data-tone={tone}/>{label}</span>)}</div>;
export const DiagramNode=({kind='system',title,meta}:{kind?:string;title:string;meta?:string})=><div className="diagram-node" data-kind={kind}><b>{title}</b>{meta?<small>{meta}</small>:null}</div>;
export const DiagramEdge=({label}:{label?:string})=><span className="diagram-edge" aria-label={label||'flow'}>{label}</span>;
export const BoundaryGroup=({label,children,tone='platform'}:{label:string;children:ReactNode;tone?:string})=><section className="boundary-group" data-tone={tone}><header>{label}</header>{children}</section>;
export const Swimlane=({label,children}:{label:string;children:ReactNode})=><div className="swimlane"><strong>{label}</strong><div>{children}</div></div>;
export const MetricAnnotation=({label,value,note}:{label:string;value:string;note?:string})=><div className="metric-annotation"><small>{label}</small><b>{value}</b>{note?<em>{note}</em>:null}</div>;
export const RiskBadge=({level}:{level:'low'|'medium'|'high'})=><span className="risk-badge" data-level={level}>{level}</span>;
export const DataSourceLabel=({children}:{children:ReactNode})=><span className="data-source-label">Source · {children}</span>;
export const HumanDecisionGate=({children}:{children:ReactNode})=><div className="human-gate"><span>HUMAN AUTHORITY</span><b>{children}</b></div>;
export const SystemBoundary=BoundaryGroup;
export const EvidenceSource=({title,detail}:{title:string;detail:string})=><div className="evidence-source"><b>{title}</b><small>{detail}</small></div>;
export const CalloutAnnotation=({index,children}:{index:string;children:ReactNode})=><aside className="callout-annotation"><b>{index}</b><span>{children}</span></aside>;
export const FigureToolbar=({children}:{children:ReactNode})=><div className="figure-toolbar" aria-label="Figure controls and context">{children}</div>;
export const ZoomableCanvas=({label,children}:{label:string;children:ReactNode})=><div className="zoomable-canvas" role="group" aria-label={label} tabIndex={0}>{children}</div>;
