import { archiveArticles } from '../data/archive';

const focusAreas = [
  ['Aviation Systems', 'Maintenance intelligence, telemetry, event-driven operations, MRO modernization, and operational reliability.'],
  ['Enterprise AI', 'Practical patterns for agents, RAG, governance, evaluation, deployment engineering, and safe adoption.'],
  ['Cloud Architecture', 'AWS, distributed systems, platform engineering, resilience, data platforms, and modernization.']
];

const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
}).format(new Date(`${value}T00:00:00Z`));

export default function HomePage() {
  const latest = archiveArticles.slice(0, 6);

  return (
    <main>
      <nav>
        <a className="brand" href="/">AVIATION AI MODERNIZATION</a>
        <div className="navlinks"><a href="#latest">Latest</a><a href="/articles">79 Articles</a><a href="#about">About</a></div>
      </nav>

      <section className="hero">
        <div className="kicker">Enterprise AI · Aviation · AWS · Forward Deployed Engineering</div>
        <h1>Architecture for technology that must survive contact with reality.</h1>
        <p className="lead">Independent field notes on cloud modernization, distributed systems, enterprise AI, aviation technology, and the engineering work required to move from prototypes to measurable production outcomes.</p>
        <div className="heroActions"><a className="cta" href="/articles">Explore the full archive →</a><a className="textLink" href="/articles/what-the-fde-boom-means-for-engineering-leaders">Read the July field note</a></div>
      </section>

      <section className="stats" aria-label="Publication statistics">
        <div><strong>79</strong><span>Monthly articles</span></div>
        <div><strong>2020–2026</strong><span>Technology timeline</span></div>
        <div><strong>1+</strong><span>New article monthly</span></div>
        <div><strong>Human</strong><span>Approval before distribution</span></div>
      </section>

      <section className="sectionHeader"><div><div className="kicker">Research domains</div><h2>Built for engineering leaders and hands-on architects</h2></div></section>
      <section className="grid">
        {focusAreas.map(([title, copy]) => <article className="card" key={title}><div className="kicker">Focus area</div><h3>{title}</h3><p>{copy}</p></article>)}
      </section>

      <section id="latest" className="latestSection">
        <div className="sectionHeader"><div><div className="kicker">Latest field notes</div><h2>From AI deployment to forward deployed engineering</h2></div><a href="/articles">View all 79 →</a></div>
        <div className="latestGrid">
          {latest.map((article) => (
            <a className="latestCard" href={`/articles/${article.slug}`} key={article.slug}>
              <div className="archiveMeta"><time dateTime={article.date}>{formatDate(article.date)}</time><span>{article.category}</span></div>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
            </a>
          ))}
        </div>
      </section>

      <footer id="about"><strong>Aviation AI Modernization</strong><br />Written for people responsible for systems that cannot be repaired by adding another chatbot and scheduling a steering committee.</footer>
    </main>
  );
}
