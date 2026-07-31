type FigureProps = {
  title: string;
  caption: string;
};

const Service = ({ x, y, w = 122, h = 52, label, sublabel, tone = 'blue' }: { x: number; y: number; w?: number; h?: number; label: string; sublabel?: string; tone?: 'blue' | 'orange' | 'green' | 'purple' | 'red' }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={h} rx="8" className={`arch-node arch-${tone}`} />
    <text x={w / 2} y={sublabel ? 22 : 31} textAnchor="middle" className="arch-label">{label}</text>
    {sublabel ? <text x={w / 2} y={39} textAnchor="middle" className="arch-sublabel">{sublabel}</text> : null}
  </g>
);

const Arrow = ({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label?: string }) => (
  <g>
    <path d={`M ${x1} ${y1} L ${x2} ${y2}`} className="arch-arrow" markerEnd="url(#arrowhead)" />
    {label ? <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 7} textAnchor="middle" className="arch-flow-label">{label}</text> : null}
  </g>
);

export function MaintenanceIntelligenceFigure({ title, caption }: FigureProps) {
  return (
    <figure className="architecture-figure">
      <div className="figure-heading"><span>FIG. 01</span><strong>{title}</strong></div>
      <svg viewBox="0 0 1180 760" role="img" aria-label={title} className="architecture-svg">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" className="arch-arrowhead" /></marker>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" className="arch-grid-line" /></pattern>
        </defs>
        <rect width="1180" height="760" rx="18" className="arch-canvas" />
        <rect x="0" y="0" width="1180" height="760" rx="18" fill="url(#grid)" />

        <text x="42" y="48" className="arch-zone-title">AIRCRAFT + AIRPORT EDGE</text>
        <rect x="32" y="66" width="1116" height="128" rx="12" className="arch-zone" />
        <Service x={62} y={102} label="ACARS / AHM" sublabel="fault + health messages" tone="orange" />
        <Service x={232} y={102} label="QAR / FOQA" sublabel="high-volume flight data" tone="orange" />
        <Service x={402} y={102} label="eTechLog" sublabel="pilot + technician reports" tone="orange" />
        <Service x={572} y={102} label="MRO System" sublabel="history + work orders" tone="orange" />
        <Service x={742} y={102} label="Fleet Context" sublabel="tail + config + ATA" tone="orange" />
        <Service x={912} y={102} label="Weather / Ops" sublabel="phase + environment" tone="orange" />

        <text x="42" y="240" className="arch-zone-title">AWS INGESTION + DATA FOUNDATION</text>
        <rect x="32" y="258" width="1116" height="180" rx="12" className="arch-zone" />
        <Service x={74} y={300} label="API Gateway" sublabel="secure partner APIs" tone="red" />
        <Service x={248} y={300} label="Amazon MSK" sublabel="ordered event streams" tone="purple" />
        <Service x={422} y={300} label="AWS Lambda" sublabel="validation + routing" tone="orange" />
        <Service x={596} y={300} label="Amazon S3" sublabel="immutable raw + curated" tone="green" />
        <Service x={770} y={300} label="Glue Catalog" sublabel="schema + lineage" tone="purple" />
        <Service x={944} y={300} label="EventBridge" sublabel="domain event routing" tone="blue" />
        <Arrow x1={196} y1={326} x2={248} y2={326} />
        <Arrow x1={370} y1={326} x2={422} y2={326} />
        <Arrow x1={544} y1={326} x2={596} y2={326} />
        <Arrow x1={718} y1={326} x2={770} y2={326} />
        <Arrow x1={892} y1={326} x2={944} y2={326} />

        <text x="42" y="486" className="arch-zone-title">DECISION SERVICES</text>
        <rect x="32" y="504" width="718" height="204" rx="12" className="arch-zone" />
        <Service x={70} y={548} label="Rules Engine" sublabel="limits + approved logic" tone="blue" />
        <Service x={246} y={548} label="Anomaly Models" sublabel="trend + drift + cohorts" tone="purple" />
        <Service x={422} y={548} label="Amazon Bedrock" sublabel="retrieval + summarization" tone="orange" />
        <Service x={598} y={548} label="Evidence Service" sublabel="confidence + provenance" tone="green" />
        <Arrow x1={192} y1={574} x2={246} y2={574} />
        <Arrow x1={368} y1={574} x2={422} y2={574} />
        <Arrow x1={544} y1={574} x2={598} y2={574} />
        <Service x={246} y={628} w={300} label="Maintenance Decision Brief" sublabel="facts · evidence · uncertainty · next review" tone="red" />
        <Arrow x1={396} y1={600} x2={396} y2={628} />

        <text x="790" y="486" className="arch-zone-title">OPERATIONAL WORKFLOWS</text>
        <rect x="780" y="504" width="368" height="204" rx="12" className="arch-zone" />
        <Service x={814} y={544} label="MCC Console" sublabel="triage + disposition" tone="red" />
        <Service x={982} y={544} label="Reliability" sublabel="fleet trend review" tone="blue" />
        <Service x={814} y={626} label="Digital Work Pack" sublabel="planning + execution" tone="green" />
        <Service x={982} y={626} label="Outcome Capture" sublabel="confirmed / NFF / action" tone="purple" />
        <Arrow x1={750} y1={654} x2={814} y2={654} label="workflow-ready insight" />
        <Arrow x1={1104} y1={652} x2={1104} y2={392} label="feedback" />
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function HumanAuthorityFigure({ title, caption }: FigureProps) {
  const steps = [
    ['01', 'Signal detected', 'Telemetry, pilot report, repeat defect, or planning constraint'],
    ['02', 'Evidence assembled', 'Configuration, history, manuals, prior findings, and operating context'],
    ['03', 'Machine assessment', 'Rules, statistics, retrieval, and model-supported hypothesis generation'],
    ['04', 'Licensed review', 'Engineer, MCC controller, planner, or technician evaluates evidence'],
    ['05', 'Approved action', 'Inspection, troubleshooting, deferment review, work order, or no action'],
    ['06', 'Outcome returned', 'Confirmed fault, no-fault-found, replaced component, or revised diagnosis']
  ];
  return (
    <figure className="architecture-figure workflow-figure">
      <div className="figure-heading"><span>FIG. 01</span><strong>{title}</strong></div>
      <div className="human-workflow">
        {steps.map(([n, heading, copy], index) => (
          <div className="workflow-step" key={n}>
            <div className="workflow-number">{n}</div>
            <div><h4>{heading}</h4><p>{copy}</p></div>
            {index < steps.length - 1 ? <div className="workflow-connector">→</div> : null}
          </div>
        ))}
      </div>
      <div className="authority-band"><strong>Human authority boundary</strong><span>No model output becomes maintenance instruction without approved workflow, evidence, and qualified review.</span></div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
