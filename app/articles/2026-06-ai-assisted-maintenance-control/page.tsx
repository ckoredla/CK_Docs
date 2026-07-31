import { HumanAuthorityFigure } from '../../components/ArchitectureFigures';
import { ArticleShell } from '../../components/ArticleShell';
import { ExecutiveSummary, KeyTakeaways, ReferenceList } from '../../components/Publication';
import { getArticle } from '../../lib/articles';

const article = getArticle('2026-06-ai-assisted-maintenance-control');
export const metadata = { title: article.title, description: article.description, alternates: { canonical: `/articles/${article.slug}` }, openGraph: { type: 'article' as const, title: article.title, description: article.description, publishedTime: article.publishedAt, modifiedTime: article.updatedAt || article.publishedAt } };

export default function ArticlePage() {
  return (
    <ArticleShell article={article}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.description, datePublished: article.publishedAt, dateModified: article.updatedAt || article.publishedAt, mainEntityOfPage: `https://northboundlabs.ai/articles/${article.slug}`, publisher: { '@type': 'Organization', name: 'Northbound Labs' } }) }} />
        <ExecutiveSummary>
        <p>Maintenance control is not a generic service desk with aircraft terminology added. Its decisions sit inside a regulated operating system shaped by technical evidence, approved procedures, time pressure, network consequences, and professional accountability.</p>
        <p>That makes maintenance control an attractive place for AI assistance and a dangerous place for careless automation. The useful design question is not whether AI can recommend an action. It is where machine assistance should stop, where qualified review must begin, and how the evidence should travel with the decision.</p>
        </ExecutiveSummary>

        <div className="callout"><strong>Operating principle:</strong> AI may assemble evidence, identify patterns, retrieve relevant history, and structure a hypothesis. Authority for maintenance disposition remains inside approved human and organizational controls.</div>

        <h2>1. Separate assistance from authority</h2>
        <p>A model output can be useful without being authoritative. This distinction sounds obvious until a polished interface presents a generated summary beside a confidence score and quietly causes people to treat it as a decision.</p>
        <p>The product should explicitly label observed facts, retrieved records, derived indicators, machine hypotheses, procedural references, and human conclusions. Mixing them into a single paragraph creates speed at the expense of auditability.</p>

        <h2 id="operating-model">2. The operating model</h2>
        <HumanAuthorityFigure
          title="Maintenance-control decision cycle with a visible human authority boundary"
          caption="Machine assistance accelerates evidence assembly and pattern recognition. Qualified personnel retain responsibility for interpreting the evidence, selecting approved action, and recording the operational outcome."
        />

        <h2>3. Design the brief, not merely the chatbot</h2>
        <p>The most valuable interface may not be conversational. A structured maintenance decision brief can be faster to inspect, easier to compare, and more defensible after the event.</p>
        <ul>
          <li><strong>Observed condition:</strong> what was reported or measured, with source and time.</li>
          <li><strong>Aircraft context:</strong> tail, fleet, configuration, software standard, flight phase, and environmental context.</li>
          <li><strong>Relevant history:</strong> prior defects, removals, inspections, deferred items, and similar fleet events.</li>
          <li><strong>Technical references:</strong> approved manuals, engineering orders, and controlled documents.</li>
          <li><strong>Machine assessment:</strong> hypothesis, supporting evidence, contradictory evidence, and uncertainty.</li>
          <li><strong>Human disposition:</strong> selected action, reviewer identity, time, and rationale.</li>
        </ul>

        <h2>4. Retrieval quality is a safety feature</h2>
        <p>A retrieval system that returns a plausible but obsolete document is not merely inconvenient. Version, applicability, fleet effectivity, and document control belong in the retrieval design.</p>
        <p>The system should prefer approved and effective technical content, surface document status, preserve citations, and reject unsupported generation. In this domain, “the answer sounded right” is not a quality measure. It is often the beginning of an incident review.</p>

        <h2>5. Treat confidence carefully</h2>
        <p>A numerical confidence score can create false precision. Operators need to know what evidence exists, what is missing, whether the case resembles known history, and which assumptions influence the result.</p>
        <p>Useful uncertainty communication includes evidence coverage, data freshness, conflicting signals, model applicability, and known blind spots. A lower-confidence assessment with strong provenance may be more useful than a high-confidence sentence with no inspectable path.</p>

        <h2>6. Preserve workload realism</h2>
        <p>An MCC tool must work during disruption, shift handover, multiple simultaneous defects, and incomplete information. It should reduce cognitive load rather than create another queue requiring attention.</p>
        <ul>
          <li>Prioritize by operational and technical significance, not model novelty.</li>
          <li>Support rapid comparison of similar cases.</li>
          <li>Show what changed since the prior review.</li>
          <li>Carry the brief across shift handover.</li>
          <li>Allow dismissal, correction, and escalation without interface gymnastics.</li>
        </ul>

        <h2>7. Measure whether the assistance helps</h2>
        <p>Adoption and model accuracy are insufficient. The program should measure decision latency, evidence completeness, repeat review, troubleshooting efficiency, false escalation, missed significant cases, user corrections, and downstream outcomes.</p>
        <p>The most revealing metric may be how often a reviewer changes the machine-created brief and why. Those edits expose gaps in data, retrieval, terminology, context, and workflow design.</p>

        <h2>8. Governance belongs in the product</h2>
        <p>Governance should not live only in a policy document. The interface and services should enforce role boundaries, version control, citations, approval, traceability, retention, and auditable override.</p>
        <p>The platform should make the safe path the easy path. Asking professionals to compensate manually for weak product controls is not governance. It is wishful thinking with a steering committee.</p>

        <h2>Final principle</h2>
        <p>The strongest maintenance-control AI system is not the one that appears most autonomous. It is the one that makes evidence easier to inspect, uncertainty harder to hide, human authority unmistakable, and outcomes useful for learning.</p>

        <KeyTakeaways><ul><li>Separate recorded facts, machine hypotheses, and human conclusions.</li><li>Keep qualified approval inside the operational workflow.</li><li>Measure evidence completeness and reviewer corrections, not adoption alone.</li></ul></KeyTakeaways>

        <ReferenceList>
          <li><a href="https://www.faa.gov/regulations_policies/handbooks_manuals/aviation" target="_blank" rel="noreferrer">FAA aviation handbooks and manuals</a></li>
          <li><a href="https://www.faa.gov/about/initiatives/maintenance_hf" target="_blank" rel="noreferrer">FAA maintenance human factors resources</a></li>
          <li><a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noreferrer">NIST AI Risk Management Framework</a></li>
          <li><a href="https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/welcome.html" target="_blank" rel="noreferrer">AWS Machine Learning Lens</a></li>
        </ReferenceList>
    </ArticleShell>
  );
}
