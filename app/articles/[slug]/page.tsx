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

export default async function ArchiveArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = findArchiveArticle(slug);
  if (!article) notFound();

  return (
    <main>
      <nav>
        <a className="brand" href="/">AVIATION AI MODERNIZATION</a>
        <div className="navlinks"><a href="/articles">All articles</a><a href="#takeaways">Takeaways</a></div>
      </nav>

      <article className="article">
        <div className="kicker">{article.category}</div>
        <h1>{article.title}</h1>
        <p className="meta"><time dateTime={article.date}>Archive date: {formatDate(article.date)}</time> · 6 minute field note</p>
        <div className="archiveNotice"><strong>Retrospective archive:</strong> This field note was assembled in July 2026 and positioned in the month that best represents its place in the technology timeline. It is not presented as proof that the page was publicly available on that historical date.</div>

        <p className="articleLead">{article.summary}</p>

        <h2>The shift</h2>
        <p>Technology adoption rarely follows the clean diagrams used in conference presentations. A new capability arrives, teams experiment with it, and the difficult questions appear later: who owns it, what happens when it fails, how will it be secured, and whether it improves a decision that matters.</p>
        <p><strong>{article.title}</strong> belongs in that transition. Its lasting value is not the novelty of the technology, but the operating model built around it.</p>

        <h2>Architecture view</h2>
        <p>Start with the outcome and work backward. Identify the user or system making the decision, the information required, the reliability boundary, the security controls, and the feedback needed to know whether the design worked. Services and frameworks should be selected only after those constraints are understood.</p>
        <div className="diagram">{`Business or operational decision
          ↓
Trusted data and explicit contracts
          ↓
Smallest suitable technical capability
          ↓
Security, reliability and observability controls
          ↓
Workflow integration and accountable ownership
          ↓
Measured outcome and learning loop`}</div>

        <h2>What engineering leaders should ask</h2>
        <ul>
          <li>Which measurable decision or workflow becomes better?</li>
          <li>What is the smallest architecture that can deliver the result safely?</li>
          <li>Who owns the system after the initial launch team leaves?</li>
          <li>How are failures detected, explained, contained, and recovered?</li>
          <li>What evidence will distinguish adoption from an impressive demonstration?</li>
        </ul>

        <h2 id="takeaways">Practical takeaways</h2>
        <p>Standardize the repeatable parts, preserve room for domain-specific judgment, and keep the system observable from source data through business outcome. Complexity should be earned by a real requirement. It should not be added because the industry recently discovered a new noun.</p>
        <p>The strongest teams connect architecture, product thinking, delivery, and operations. That combination explains why modern AI organizations increasingly value forward deployed engineering: someone still has to turn sophisticated capability into software that works inside an actual enterprise.</p>

        <div className="articleFooter">
          <a href="/articles">← Return to the complete archive</a>
        </div>
      </article>
    </main>
  );
}
