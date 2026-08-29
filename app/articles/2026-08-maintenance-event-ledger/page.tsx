import type { Metadata } from 'next';
import { ArticleShell } from '../../components/ArticleShell';
import type { ArticleRecord } from '../../lib/articles';
import { PublicationVisual, type PublicationVisualContext } from '../../../src/components/publication';

const article: ArticleRecord = {
  id:'nbl-2026-08-28', title:'Build a Maintenance Event Ledger Before You Build More AI', slug:'2026-08-maintenance-event-ledger', issueDate:'2026-08-28',
  publishedAt:'2026-08-28T19:00:00-05:00', updatedAt:'2026-08-28T19:00:00-05:00',
  summary:'A reference architecture for creating an immutable, replayable maintenance event backbone before layering analytics and AI over operational workflows.',
  description:'How airlines can connect maintenance state changes, aircraft evidence, lineage, and downstream intelligence through a governed event ledger.',
  categories:['MRO Modernization','Data & Cloud Architecture'], topicTags:['Event ledger','Event-driven architecture','Evidence lineage'], ataChapters:[],
  articleType:'Reference Architecture', estimatedReadingTime:10, publicationStatus:'published', featuredStatus:'featured',
  diagramIdentifiers:['maintenance-event-ledger'], referenceCount:5, relatedArticleSlugs:['2026-08-maintenance-observability','2026-08-digital-shift-handover'],
  previousArticleSlug:'2026-08-digital-shift-handover', nextArticleSlug:null
};

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  alternates:{canonical:`/articles/${article.slug}`},
  openGraph:{type:'article',title:article.title,description:article.description,publishedTime:article.publishedAt}
};

export default function MaintenanceEventLedgerPage(){
  const visualContext: PublicationVisualContext={slug:article.slug,title:article.title,domain:'aircraft maintenance event architecture',tags:article.topicTags,ata:[],issueDate:article.issueDate,brief:'A governed event backbone that preserves maintenance state changes and evidence lineage without replacing authoritative maintenance records.'};
  const mermaid=`flowchart LR
    A[Authoritative MRO systems] -->|state-change events| B[Domain event gateway]
    T[Aircraft telemetry and health] -->|evidence references| B
    O[Operations and configuration] -->|context events| B
    B --> C{Contract + identity valid?}
    C -- No --> Q[Quarantine / data-quality queue]
    C -- Yes --> E[Event bus]
    E --> L[(Immutable event archive)]
    E --> S[SQS consumer queues]
    S --> P[Idempotent projections]
    P --> R[Reliability views]
    P --> H[Handover / control views]
    P --> M[AI and analytics features]
    L -->|replay| P
    M --> X[Qualified human review]
    X --> A`;

  return <ArticleShell article={article}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:article.title,description:article.description,datePublished:article.publishedAt,dateModified:article.updatedAt,mainEntityOfPage:`https://northboundlabs.ai/articles/${article.slug}`,author:{'@type':'Person',name:'Chaitanya Koredla'},publisher:{'@type':'Organization',name:'Northbound Labs'}})}} />
    <div className="article-body">
      <p className="lead">Airlines can buy another dashboard, train another model, or add another copilot. None of those fixes a more basic problem: maintenance state is often reconstructed after the fact from systems that were designed to execute work, not to preserve a clean sequence of operational change. Before adding more intelligence, build an event backbone that can explain what changed, when, why, and from which authoritative source.</p>

      <section><h2>Executive summary</h2><p>A maintenance event ledger is not a new maintenance system of record. It is a governed, append-oriented history of domain events emitted by authoritative systems: a discrepancy opened, troubleshooting step recorded, part removed, task status changed, engineering response received, deferral state changed, or post-maintenance evidence observed. Each event carries stable identity, source references, timestamps, schema version, and correlation context.</p><p>The value is architectural. Reliability products can rebuild a fleet view from the same evidence used by a shift-handover product. An AI assistant can retrieve the sequence behind a case instead of guessing from a current-state snapshot. If a projection fails or business logic changes, the derived view can be replayed. AWS describes event sourcing as maintaining a history of state-changing events to support auditability, traceability, analysis, and reconstruction of prior state.</p></section>

      <section><h2>1. Current state is not enough</h2><p>A conventional integration asks, “What is the status now?” Maintenance intelligence often needs a harder question: “How did we get here?” A current discrepancy record may show an open condition, but a reliability engineer may need the sequence of prior actions, configuration changes, removals, messages, operating exposure, and prior closures that shaped the case.</p><p>This does not mean copying every database mutation into a lake and calling it an event architecture. Domain events should describe meaningful business transitions with stable semantics. “PartRemoved” is useful. “RowUpdated” is mostly an invitation to make every downstream team reverse-engineer the source application forever.</p></section>

      <section><h2>2. Reference architecture</h2><p>The pattern below separates authoritative execution from derived intelligence. Source systems remain authoritative. The event layer captures state transitions, validates contracts and identity, archives immutable envelopes, and fans out to independently scalable consumers.</p><PublicationVisual context={visualContext} role="hero"/><details><summary>Mermaid source for the reference architecture</summary><pre><code>{mermaid}</code></pre></details><p><strong>Design reading:</strong> authoritative MRO, aircraft, configuration, and operational systems publish bounded events. Invalid identity or contracts are quarantined rather than quietly normalized. Valid events are routed, archived, and delivered to idempotent consumers. Derived reliability, control, handover, and AI views can be rebuilt from the ledger. Human decisions return through approved operational workflows, not through an analytics side door.</p></section>

      <section><h2>3. Define an aviation-grade event contract</h2><p>At minimum, carry an immutable event ID, event type and schema version, source system and source-record reference, aircraft identity where applicable, event time, ingestion time, correlation or case ID, actor or system origin, effectivity/configuration references when relevant, and a pointer to supporting evidence. Keep the routing envelope small; retrieve large evidence objects from governed stores on demand.</p><p>Identity deserves special treatment. Tail number alone may be insufficient when component position, serial number, installation interval, software standard, or configuration changes the meaning of an observation. If identity cannot be resolved confidently, quarantine the event or mark the derived interpretation uncertain. Do not manufacture continuity because a join happened to succeed.</p></section>

      <section><h2>4. Design for duplicate delivery and replay</h2><p>Event-driven systems should assume retries and duplicate delivery. AWS Well-Architected guidance recommends idempotency tokens for mutating operations and notes that event-driven consumers should prevent duplicate messages from producing repeated side effects. Give every business event a durable identifier and make projection updates idempotent.</p><p>Replay is equally important. AWS event-sourcing guidance highlights reconstruction and auditability as core benefits of preserving state-changing events. A new reliability algorithm should be able to rebuild its projection from retained events without rewriting source maintenance history. Replay must be controlled, observable, and separated from live side effects so yesterday's events do not accidentally create today's notifications or work actions.</p></section>
      <PublicationVisual context={visualContext} role="evidence"/>

      <section><h2>5. AWS implementation pattern</h2><p>Amazon EventBridge can route domain events by content to independent targets. Amazon SQS can buffer consumers that need back-pressure and isolated retry behavior. Lambda, ECS, or other compute can validate and project events. S3 can retain immutable event envelopes and larger evidence objects; DynamoDB or purpose-built stores can serve current projections. The exact service mix is less important than the boundaries: durable identity, versioned contracts, decoupled consumers, replay, dead-letter handling, and observable delivery.</p><p>AWS guidance describes EventBridge as an event router and recommends explicit producer-consumer data contracts. Current EventBridge guidance also recommends monitoring delivery attempts, retries, failed invocations, dead-letter activity, and end-to-end delivery latency. Those are not merely cloud metrics here. They are evidence that maintenance intelligence is receiving the operational transitions it claims to represent.</p></section>

      <section><h2>6. Put AI downstream of evidence</h2><p>An AI maintenance assistant should consume a governed projection or retrieve bounded event evidence, not become the first component that tries to reconcile raw operational systems. The event ledger gives models temporal context: what preceded the condition, what changed after an action, and which evidence belongs to the same case.</p><p>AI can summarize a sequence, cluster similar histories, rank evidence, or identify a missing expected transition. It should not invent a missing event, infer work accomplishment, sign maintenance records, or convert an analytics result into maintenance authority. FAA AC 120-16G describes the scope of air-carrier maintenance programs, while AC 120-17B emphasizes documented reliability investigation and recommendations when performance varies from standards. The software architecture should support those accountable processes, not blur them.</p></section>

      <section><h2>7. Start with five events, not five hundred</h2><p>A practical pilot chooses one workflow and a small vocabulary, for example DiscrepancyOpened, CorrectiveActionRecorded, ComponentRemoved, MaintenanceCompleted, and PostMaintenanceEvidenceObserved. Define ownership and schemas, instrument source publication, validate lineage, build one replayable projection, and measure missing, late, duplicate, and quarantined events.</p><p>Only then expand the domain vocabulary. Event catalogs become useless when every integration team invents synonyms. Governance should be lightweight but real: schema ownership, compatibility rules, retention, sensitive-data handling, event-level service objectives, and a review process for semantic changes.</p></section>

      <section><h2>Editorial note</h2><p>This article is independent engineering analysis and a reference architecture. It does not describe or claim implementation by any specific airline, manufacturer, MRO, or employer. It is not approved maintenance data, regulatory interpretation, or an operator procedure. Maintenance authority, records, task accomplishment, engineering disposition, and return-to-service decisions remain with the applicable approved programs and qualified personnel. AWS services are illustrative technical choices.</p></section>

      <section id="references"><h2>Sources</h2><ul>
        <li><a href="https://www.faa.gov/regulations_policies/advisory_circulars/index.cfm/go/document.information/documentid/1035253">FAA AC 120-17B, Reliability Program Methods—Standards for Determining Time Limitations (active; editorial update July 9, 2026)</a></li>
        <li><a href="https://www.faa.gov/airports/resources/advisory_circulars/index.cfm/go/document.information/documentNumber/120-16G">FAA AC 120-16G, Air Carrier Maintenance Programs</a></li>
        <li><a href="https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/event-sourcing-pattern.html">AWS Prescriptive Guidance, Event sourcing pattern</a></li>
        <li><a href="https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_prevent_interaction_failure_idempotent.html">AWS Well-Architected Reliability Pillar, Make mutating operations idempotent</a></li>
        <li><a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-monitoring-events-best-practices.html">Amazon EventBridge, Best practices for monitoring event delivery</a></li>
      </ul></section>
    </div>
  </ArticleShell>;
}
