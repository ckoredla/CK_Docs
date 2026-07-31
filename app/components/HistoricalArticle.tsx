import { notFound } from 'next/navigation';
import { ArticleShell } from './ArticleShell';
import { ExecutiveSummary, KeyTakeaways, ReferenceList } from './Publication';
import { SystemDiagram } from './DiagramSystem';
import { ArticleVisual, type VisualPlan } from './WhitepaperVisuals';
import { getArticle } from '../lib/articles';
import { historicalIssues } from '../lib/historicalCatalog';

const references = [
  ['FAA aviation handbooks and manuals','https://www.faa.gov/regulations_policies/handbooks_manuals/aviation'],
  ['FAA Maintenance Human Factors resources','https://www.faa.gov/about/initiatives/maintenance_hf'],
  ['NASA Technical Reports Server','https://ntrs.nasa.gov/'],
  ['ICAO safety-management guidance material','https://www.icao.int/safety/SafetyManagement/Pages/Guidance-Material.aspx']
];

export function HistoricalArticle({slug}:{slug:string}){
  const issue=historicalIssues.find((item)=>item.slug===slug);if(!issue)notFound();const article=getArticle(slug);
  const nodes=[
    {id:'evidence',label:'Recorded evidence',detail:issue.domain,x:35,y:90,tone:'orange' as const},
    {id:'context',label:'Operational context',detail:'identity · time · effectivity',x:225,y:280,tone:'blue' as const},
    {id:'logic',label:'Bounded analysis',detail:'rules · patterns · limits',x:415,y:90,tone:'purple' as const},
    {id:'review',label:'Qualified review',detail:'challenge · authority',x:605,y:280,tone:'red' as const},
    {id:'outcome',label:'Outcome evidence',detail:'finding · action · learning',x:795,y:90,tone:'green' as const}
  ];
  const visualPlan:VisualPlan={
    compare:[`Fragmented ${issue.domain}`,`Controlled ${issue.domain}`,['Source evidence','Operational context','Decision authority','Outcome learning']],
    sequence:[`Record ${issue.domain} evidence`,'Resolve identity and applicability','Apply bounded analytical logic','Qualified domain review','Return confirmed outcome'],
    risks:[[issue.failure,'High','Evidence and authority gate'],['Missing applicability','High','Effectivity control'],['Unlinked outcome','Medium','Outcome stewardship']],
    metrics:[['Evidence completeness','Decision SLO','measured'],['Reviewer correction','Review signal','governed'],['Outcome linkage','Trace control','audited']],
    states:['Evidence received','Context resolved','Assessment bounded','Decision reviewed','Outcome linked']
  };
  return <ArticleShell article={article}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:article.title,description:article.description,datePublished: article.publishedAt,dateModified:article.updatedAt||article.publishedAt,mainEntityOfPage:`https://northboundlabs.ai/articles/${slug}`,publisher:{'@type':'Organization',name:'Northbound Labs'}})}}/>
    <ExecutiveSummary><p>The central problem in {issue.domain} is not a shortage of technology. It is that {issue.challenge}. A useful design must preserve operational meaning while making the next decision easier to inspect.</p><p>This paper proposes a bounded approach: {issue.design}. The intent is decision support with explicit evidence and accountable authority—not an automated substitute for approved maintenance data, engineering judgment, or licensed action.</p></ExecutiveSummary>
    <SystemDiagram id={`${slug}-context`} kind="human-in-the-loop" title={`Decision architecture for ${issue.domain}`} caption="The architecture separates source evidence, operational context, analytical logic, qualified authority, and confirmed outcome so each can be challenged independently." nodes={nodes} edges={[{from:'evidence',to:'context'},{from:'context',to:'logic'},{from:'logic',to:'review',label:'evidence brief'},{from:'review',to:'outcome'}]}/>
    <section><h2>1. Define the operational decision</h2><p>Programs often begin by collecting available data or selecting a platform. That reverses the useful order. The team should first identify who must decide, when the decision occurs, which evidence is authoritative, what uncertainty is acceptable, and which action remains under qualified control.</p><p>For {issue.domain}, the dominant constraint is that {issue.challenge}. The product boundary should therefore be written as a decision contract: inputs, freshness, effectivity, interpretation rules, exclusions, reviewer role, downstream record, and measurable outcome. This contract gives engineering and operations a shared definition of done.</p><ArticleVisual slug={slug} index={0} plan={visualPlan}/></section>
    <section><h2>2. Preserve evidence before interpretation</h2><p>Source records should retain identity, event time, ingestion time, configuration context, revision, lineage, and quality state. Normalized concepts are valuable, but they should never overwrite what the source actually reported. Investigators need to reproduce the view that existed when a decision was made.</p><p>The recommended design is to {issue.design}. Derived features, rules, statistical output, retrieved text, and generated synthesis should be distinguishable in storage and in the user interface. That separation supports correction without rewriting history and allows reviewers to challenge an inference while accepting the underlying evidence.</p><ArticleVisual slug={slug} index={1} plan={visualPlan}/></section>
    <section><h2>3. Engineer the authority boundary</h2><p>Operational software can assemble context, identify patterns, rank attention, and prepare a structured brief. It cannot create maintenance authority. The interface must identify the governing source, effective revision, responsible role, and required disposition. Override and abstention are normal system behaviors.</p><p>The most important anti-pattern is {issue.failure}. It tends to appear efficient because ambiguity disappears from the screen. In reality the ambiguity has only been hidden from the person accountable for the decision. Controls should make missing context, conflict, and inapplicability prominent enough to change behavior.</p><ArticleVisual slug={slug} index={2} plan={visualPlan}/></section>
    <section><h2>4. Implementation, governance, and limitations</h2><p>A credible first release should {issue.practice}. The team should conduct prospective shadow use, compare product output with actual engineering reconstruction, and record why reviewers accept, modify, or reject the result. Expansion should depend on evidence quality and workflow value rather than demonstration appeal.</p><p>Governance belongs in the service itself: access control, source eligibility, versioning, release evidence, monitoring, rollback, retention, and outcome stewardship. Limitations should be published by fleet, configuration, operating regime, source availability, and decision type. When applicability cannot be established, the safe result is a visible abstention.</p><p>Measures should connect technical behavior to the decision contract. Useful families include evidence completeness, freshness, unresolved identity, reviewer correction, false escalation, missed significant cases, decision latency, recurrence, and outcome-linkage quality. These measures are meaningful only when segmented by the operational conditions that influence them.</p></section>
    <KeyTakeaways><ul><li>Begin with a named decision, accountable role, and evidence contract.</li><li>Preserve recorded facts separately from normalization and inference.</li><li>Design explicitly against {issue.failure}.</li><li>{issue.practice.charAt(0).toUpperCase()+issue.practice.slice(1)}.</li></ul></KeyTakeaways>
    <ReferenceList>{references.map(([label,href])=><li key={href}><a href={href} target="_blank" rel="noreferrer">{label}</a></li>)}</ReferenceList>
  </ArticleShell>
}
