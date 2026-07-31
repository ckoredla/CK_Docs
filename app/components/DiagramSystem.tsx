export type DiagramKind = 'architecture' | 'data-flow' | 'workflow' | 'decision-tree' | 'timeline' | 'feedback-loop' | 'event-pipeline' | 'human-in-the-loop' | 'aircraft-to-cloud' | 'swimlane';
export type DiagramNode = { id: string; label: string; detail?: string; x: number; y: number; width?: number; tone?: 'blue' | 'orange' | 'green' | 'purple' | 'red' };
export type DiagramEdge = { from: string; to: string; label?: string; dashed?: boolean };

export function SystemDiagram({ id, kind, title, caption, nodes, edges }: { id: string; kind: DiagramKind; title: string; caption: string; nodes: DiagramNode[]; edges: DiagramEdge[] }) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return <figure className="architecture-figure" data-diagram-id={id} data-diagram-kind={kind}>
    <div className="figure-heading"><span>Figure</span><strong>{title}</strong></div>
    <svg className="architecture-svg" viewBox="0 0 1000 560" role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>{title}</title><desc id={`${id}-description`}>{caption}</desc>
      <defs><marker id={`${id}-arrow`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" className="arch-arrowhead" /></marker></defs>
      <rect width="1000" height="560" rx="16" className="arch-canvas" />
      {edges.map((edge, index) => { const from = byId.get(edge.from); const to = byId.get(edge.to); if (!from || !to) return null; const fromWidth = from.width || 170; return <g key={`${edge.from}-${edge.to}-${index}`}><path d={`M ${from.x + fromWidth} ${from.y + 34} L ${to.x} ${to.y + 34}`} className="arch-arrow" strokeDasharray={edge.dashed ? '6 5' : undefined} markerEnd={`url(#${id}-arrow)`} />{edge.label ? <text x={(from.x + fromWidth + to.x) / 2} y={(from.y + to.y) / 2 + 20} textAnchor="middle" className="arch-flow-label">{edge.label}</text> : null}</g>; })}
      {nodes.map((node) => <g transform={`translate(${node.x} ${node.y})`} key={node.id}><rect width={node.width || 170} height="68" rx="8" className={`arch-node arch-${node.tone || 'blue'}`} /><text x={(node.width || 170) / 2} y={node.detail ? 29 : 39} textAnchor="middle" className="arch-label">{node.label}</text>{node.detail ? <text x={(node.width || 170) / 2} y="48" textAnchor="middle" className="arch-sublabel">{node.detail}</text> : null}</g>)}
    </svg>
    <figcaption>{caption}</figcaption>
  </figure>;
}
