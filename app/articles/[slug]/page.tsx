import { notFound } from 'next/navigation';
import { archiveArticles, findArchiveArticle } from '../../../data/archive';

export function generateStaticParams() {
  return archiveArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = findArchiveArticle(slug);
  return article ? { title: `${article.title} | Aviation AI Modernization`, description: article.summary } : {};
}

const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'
}).format(new Date(`${value}T00:00:00Z`));

const architectureByCategory: Record<string, string[]> = {
  'AWS Architecture': ['Experience / API', 'Event & compute layer', 'Domain services', 'Governed data', 'Observability & controls'],
  'Enterprise AI': ['User or workflow', 'AI application layer', 'Retrieval / tools / agents', 'Models & evaluation', 'Governance & telemetry'],
  'Airline Maintenance': ['Aircraft & ground signals', 'Secure event ingestion', 'Operational context', 'Decision intelligence', 'Human maintenance action'],
  'Platform Engineering': ['Developer intent', 'Golden path', 'Delivery platform', 'Runtime controls', 'Feedback & reliability'],
  'Forward Deployed Engineering': ['Customer outcome', 'Discovery & system design', 'Rapid implementation', 'Production integration', 'Measured adoption']
};

function ArchitectureFigure({ category }: { category: string }) {
  const nodes = architectureByCategory[category] ?? ['Business outcome', 'Trusted inputs', 'Technical capability', 'Operational controls', 'Measured feedback'];
  return (
    <figure className="architectureFigure">
      <div className="architectureFlow">
        {nodes.map((node, index) => (
          <div className="architectureStep" key={node}>
            <span className="stepNumber">{String(index + 1).padStart(2, '0')}</span>
            <strong>{node}</strong>
            {index < nodes.length - 1 && <span className="flowArrow" aria-hidden="true">→</span>}
          </div>
        ))}
      </div>
      <figcaption>Reference architecture lens. Each long-form article will replace this framework with a topic-specific diagram and evidence trail.</figcaption>
    </figure>
  );
}

export default async function ArchiveArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = findArchiveArticle(slug);
  if (!article) notFound();

  return (
    <main>
      <nav>
        <a className="brand" href="/">AVIATION AI MODERNIZATION</a>
        <div className="navlinks"><a href="/articles">All articles</a><a href="#architecture">Architecture</a><a href="#takeaways">Takeaways</a></div>
      </nav>

      <article className="article">
        <div className="kicker">{article.category} · Research note</div>
        <h1>{article.title}</h1>
        <p className="meta"><time dateTime={article.date}>Archive date: {formatDate(article.date)}</time> · Editorial archive · Original synthesis</p>
        <div className="archiveNotice"><strong>Retrospective archive:</strong> This research note was assembled in July 2026 and positioned in the month that best represents its place in the technology timeline. It is not presented as proof that the page was publicly available on that historical date.</div>

        <p className="articleLead">{article.summary}</p>

        <aside className="editorialBadge">
          <strong>Publication standard</strong>
          <span>Original analysis · traceable sources · no copied prose · diagrams created for this publication · human review before distribution</span>
        </aside>

        <h2>Executive perspective</h2>
        <p>Technology adoption rarely follows the clean diagrams used in conference presentations. A capability arrives, teams experiment, and the difficult questions appear later: who owns it, what happens when it fails, how it will be secured, and whether it improves a decision that matters.</p>
        <p><strong>{article.title}</strong> belongs in that transition. Its lasting value is not novelty. The real value is the operating model, architecture, and accountability built around it.</p>

        <h2>The decision before the technology</h2>
        <div className="insightGrid">
          <div><span>01</span><strong>Outcome</strong><p>Name the business or operational decision that must improve.</p></div>
          <div><span>02</span><strong>Evidence</strong><p>Identify trusted inputs, uncertainty, lineage, and missing context.</p></div>
          <div><span>03</span><strong>Control</strong><p>Define security, reliability, approval, and recovery boundaries.</p></div>
          <div><span>04</span><strong>Learning</strong><p>Measure adoption and results rather than launch-day applause.</p></div>
        </div>

        <h2 id="architecture">Architecture view</h2>
        <p>Start with the outcome and work backward. Identify the user or system making the decision, the information required, the reliability boundary, the security controls, and the feedback needed to know whether the design worked. Services and frameworks should be selected only after those constraints are understood.</p>
        <ArchitectureFigure category={article.category} />

        <div className="callout"><strong>Architecture principle:</strong> complexity must be earned by a real requirement. A diagram should reveal decisions and boundaries, not merely arrange vendor logos into decorative plumbing.</div>

        <h2>What engineering leaders should ask</h2>
        <ul>
          <li>Which measurable decision or workflow becomes better?</li>
          <li>What is the smallest architecture that can deliver the result safely?</li>
          <li>Which assumptions require primary-source evidence?</li>
          <li>Who owns the system after the initial launch team leaves?</li>
          <li>How are failures detected, explained, contained, and recovered?</li>
          <li>What evidence will distinguish adoption from an impressive demonstration?</li>
        </ul>

        <h2 id="takeaways">Practical takeaways</h2>
        <p>Standardize the repeatable parts, preserve room for domain-specific judgment, and keep the system observable from source data through business outcome. The strongest teams connect architecture, product thinking, delivery, and operations.</p>
        <p>This archive page is a concise research note. Before it is promoted as a flagship whitepaper or distributed on LinkedIn, it must receive topic-specific research, citations, a custom architecture, an originality review, and author signoff.</p>

        <section className="researchProtocol">
          <h2>Research and originality protocol</h2>
          <ol>
            <li>Use first-party documentation, standards, research papers, and official technical material as the evidence base.</li>
            <li>Write from a fresh outline and original argument rather than paraphrasing a single source.</li>
            <li>Attribute factual claims and distinguish evidence, interpretation, and recommendation.</li>
            <li>Create diagrams from the article's own architecture reasoning. Do not copy vendor or publisher graphics.</li>
            <li>Run editorial similarity checks and manual review before publication.</li>
          </ol>
        </section>

        <div className="articleFooter">
          <a href="/articles">← Return to the complete archive</a>
        </div>
      </article>
    </main>
  );
}
