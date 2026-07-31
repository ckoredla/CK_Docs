import { MaintenanceIntelligenceFigure } from '../../components/ArchitectureFigures';
import { ArticleShell } from '../../components/ArticleShell';
import { ExecutiveSummary, KeyTakeaways, ReferenceList } from '../../components/Publication';
import { getArticle } from '../../lib/articles';

const article = getArticle('2026-07-aircraft-maintenance-intelligence-platform');
export const metadata = { title: article.title, description: article.description, alternates: { canonical: `/articles/${article.slug}` }, openGraph: { type: 'article' as const, title: article.title, description: article.description, publishedTime: article.publishedAt, modifiedTime: article.updatedAt || article.publishedAt } };

export default function ArticlePage() {
  return (
    <ArticleShell article={article}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.description, datePublished: article.publishedAt, dateModified: article.updatedAt || article.publishedAt, mainEntityOfPage: `https://northboundlabs.ai/articles/${article.slug}`, publisher: { '@type': 'Organization', name: 'Northbound Labs' } }) }} />
        <ExecutiveSummary>
        <p>Most airlines do not suffer from a shortage of maintenance data. They suffer from data arriving through different channels, carrying different identifiers, moving at different speeds, and reaching the people who need it after too much manual interpretation.</p>
        <p>A modern maintenance intelligence platform should not be another dashboard placed beside the maintenance system of record. It should create a governed decision path from aircraft signals and operational history to explainable, workflow-ready maintenance insight.</p>
        </ExecutiveSummary>

        <div className="callout"><strong>Core principle:</strong> the platform does not replace approved maintenance procedures, licensed professionals, or the system of record. It shortens the distance between weak evidence and a well-supported human decision.</div>

        <h2>1. Begin with the maintenance decision</h2>
        <p>The architecture should begin with a decision that maintenance control, reliability engineering, planning, or technicians need to make. Useful examples include identifying an emerging repeat defect, prioritizing troubleshooting before arrival, recognizing abnormal component behavior, or assembling relevant evidence before a scheduled check.</p>
        <p>Starting with the data lake, the model, or the cloud service often produces an elegant platform with no operational owner. Aviation has enough expensive objects that look impressive while sitting still.</p>

        <h2 id="architecture">2. Reference architecture</h2>
        <p>The pattern below separates aircraft and airport-edge sources, governed ingestion, operational storage, decision services, and maintenance workflows. The AWS services are representative rather than mandatory. The important design decision is the ownership boundary between evidence, inference, and approved operational action.</p>

        <MaintenanceIntelligenceFigure
          title="Aircraft maintenance intelligence platform — system context and decision path"
          caption="A human-reviewed architecture linking aircraft and ground sources to governed AWS data services, evidence-aware decision support, and operational MRO workflows. Service choices may vary; the traceable path from source evidence to outcome feedback should not."
        />

        <h2>3. Preserve meaning before applying intelligence</h2>
        <p>A fault code without aircraft configuration, flight phase, component position, software standard, and maintenance history is often incomplete evidence. The context layer is therefore one of the most important parts of the platform.</p>
        <p>Every event should preserve source identity, event time, ingestion time, aircraft identity, schema version, and data-quality status. Where possible, component identity and installation history should also be resolved. This is what allows a platform to distinguish a true fleet pattern from a change in configuration, reporting behavior, or data quality.</p>

        <h2>4. Use the simplest decision method that works</h2>
        <p>Known limits and approved deterministic logic belong in a rules engine. Drift, trend, and outlier problems may be solved with statistical methods. Machine learning becomes useful when the relationship spans many variables, operating environments, or historical outcomes.</p>
        <p>Generative AI can help summarize evidence, retrieve relevant maintenance history, and present a structured investigation brief. It should not invent technical facts, hide uncertainty, or convert a probabilistic pattern into a maintenance instruction.</p>

        <h2>5. Deliver intelligence inside the workflow</h2>
        <p>The operational product is not an alert. It is a better decision inside a real workflow. Insight should be delivered into the maintenance-control, reliability, planning, engineering, or technician experience with the supporting evidence attached.</p>
        <p>A useful maintenance insight should answer five questions: what changed, why the system surfaced it, what evidence supports it, how confident the system is, and what human review is expected next.</p>

        <h2>6. Design for traceability and safety</h2>
        <ul>
          <li>Keep the authoritative maintenance record in the approved system of record.</li>
          <li>Separate observed facts, derived features, model output, and generated text.</li>
          <li>Version schemas, rules, models, prompts, and retrieval sources.</li>
          <li>Retain lineage from the recommendation back to source evidence.</li>
          <li>Apply least-privilege access and audit all sensitive maintenance-data use.</li>
          <li>Require qualified human review for safety-sensitive decisions.</li>
        </ul>

        <h2>7. Measure operational value</h2>
        <p>Model accuracy alone does not prove that the platform helps the airline. The measures should connect technical performance to maintenance outcomes.</p>
        <ul>
          <li>Advance notice before a confirmed condition</li>
          <li>False-positive and missed-detection rates</li>
          <li>Troubleshooting time reduced</li>
          <li>Repeat-defect recurrence</li>
          <li>No-fault-found removals avoided</li>
          <li>Schedule interruption or delay exposure reduced</li>
          <li>User adoption and usefulness feedback</li>
          <li>Traceability completeness</li>
        </ul>

        <h2>8. A practical delivery sequence</h2>
        <p>Start with one fleet, one maintenance decision, and a limited set of trusted sources. Build the feedback loop before expanding the number of models or use cases. Once evidence quality, workflow adoption, and outcome capture are stable, the platform can extend across fleets and domains.</p>

        <div className="diagram"><div className="diagram-title">Incremental modernization roadmap</div>{`PHASE 1                 PHASE 2                  PHASE 3                 PHASE 4
Trusted ingestion  →    Context + lineage   →   Decision support   →   Fleet-scale learning
one use case             governed identity       rules/statistics/ML     reusable platform
one fleet                quality controls         workflow integration    portfolio governance
outcome capture          historical joins         explainability          continuous improvement`}</div>

        <h2>Final principle</h2>
        <p>A maintenance intelligence platform succeeds when it improves a specific operational decision, preserves technical evidence, fits approved maintenance workflows, and becomes more trustworthy through captured outcomes. Cloud services and AI models enable the platform. They are not the platform.</p>

        <KeyTakeaways><ul><li>Begin with a named maintenance decision and an operational owner.</li><li>Preserve context and lineage before applying inference.</li><li>Return confirmed outcomes to the platform as governed feedback.</li></ul></KeyTakeaways>

        <ReferenceList>
          <li><a href="https://www.faa.gov/regulations_policies/handbooks_manuals/aviation" target="_blank" rel="noreferrer">FAA aviation handbooks and manuals</a></li>
          <li><a href="https://ntrs.nasa.gov/" target="_blank" rel="noreferrer">NASA Technical Reports Server</a></li>
          <li><a href="https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html" target="_blank" rel="noreferrer">AWS Well-Architected Framework</a></li>
          <li><a href="https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html" target="_blank" rel="noreferrer">AWS analytics services overview</a></li>
        </ReferenceList>
    </ArticleShell>
  );
}
