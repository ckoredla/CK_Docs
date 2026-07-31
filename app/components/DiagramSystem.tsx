export type DiagramKind = 'architecture' | 'data-flow' | 'workflow' | 'decision-tree' | 'timeline' | 'feedback-loop' | 'event-pipeline' | 'human-in-the-loop' | 'aircraft-to-cloud' | 'swimlane';
export type DiagramNode = { id: string; label: string; detail?: string; x: number; y: number; width?: number; tone?: 'blue' | 'orange' | 'green' | 'purple' | 'red' };
export type DiagramEdge = { from: string; to: string; label?: string; dashed?: boolean };

export function SystemDiagram({ id, kind, title, caption, nodes, edges }: { id: string; kind: DiagramKind; title: string; caption: string; nodes: DiagramNode[]; edges: DiagramEdge[] }) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return <figure className="architecture-figure editorial-plate" data-diagram-id={id} data-diagram-kind={kind}>
    <div className="figure-heading"><span>{kind.replaceAll('-', ' ')}</span><strong>{title}</strong></div>
    <svg className="architecture-svg" viewBox="0 0 1000 560" role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>{title}</title><desc id={`${id}-description`}>{caption}</desc>
      <defs><marker id={`${id}-arrow`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" className="arch-arrowhead" /></marker></defs>
      <rect width="1000" height="560" className="arch-canvas" />
      <path d="M35 470 C230 520 700 430 965 490" className="plate-horizon" />
      {edges.map((edge, index) => { const from = byId.get(edge.from); const to = byId.get(edge.to); if (!from || !to) return null; const fromWidth = from.width || 170; const x1=from.x+fromWidth, y1=from.y+34, x2=to.x, y2=to.y+34; return <g key={`${edge.from}-${edge.to}-${index}`}><path d={`M ${x1} ${y1} C ${x1+55} ${y1}, ${x2-55} ${y2}, ${x2} ${y2}`} className="arch-arrow" strokeDasharray={edge.dashed ? '7 7' : undefined} markerEnd={`url(#${id}-arrow)`} />{edge.label ? <text x={(x1+x2)/2} y={(y1+y2)/2-12} textAnchor="middle" className="arch-flow-label">{edge.label}</text> : null}</g>; })}
      {nodes.map((node,index) => <g transform={`translate(${node.x} ${node.y})`} key={node.id} className="plate-node"><rect width={node.width || 170} height="78" className={`arch-node arch-${node.tone || 'blue'}`} /><rect width="7" height="78" className="plate-accent" /><circle cx="22" cy="19" r="10" className="plate-index-disc"/><text x="22" y="23" textAnchor="middle" className="plate-index">{index+1}</text><text x={(node.width || 170) / 2+8} y={node.detail ? 36 : 45} textAnchor="middle" className="arch-label">{node.label}</text>{node.detail ? <text x={(node.width || 170) / 2+8} y="56" textAnchor="middle" className="arch-sublabel">{node.detail}</text> : null}</g>)}
    </svg>
    <figcaption>{caption}</figcaption>
  </figure>;
}
